import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

const requiredPeerDependencies = ["next", "react", "react-dom", "@types/react", "@types/react-dom"];
const devDependencies = ["sass", "typescript"];
const dependencies = ["zod", "clsx", "@becklyn/next"];

export const init = async () => {
    console.log("🚀 Initializing @becklyn/components in your project...\n");

    const cwd = process.cwd();

    try {
        // Check if package.json exists
        const packageJsonPath = path.join(cwd, "package.json");
        if (!fs.existsSync(packageJsonPath)) {
            console.error("❌ No package.json found in current directory");
            process.exit(1);
        }

        // Check if Next.js is installed
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

        assertDependencies(packageJson, requiredPeerDependencies);

        console.log("✅ All required dependencies detected");
        console.log("📦 Installing dependencies...");

        ensureDependencies(packageJson, dependencies, devDependencies);

        console.log("✅ Dependencies installed!");

        console.log("📄 Copying styles files...");
        await copyStylesFiles(cwd);

        console.log("✅ Project initialized successfully!");
        console.log(`
🎉 You can now add components with:
   npx becklyn-components add <component>
`);
    } catch (error) {
        console.error("❌ Error during initialization:", error);
        process.exit(1);
    }
};

/**
 * Get the path to the styles directory relative to this file
 */
const getStylesPath = (): string => {
    const currentDir = __dirname;

    // Check if we're running from compiled code in the published package
    if (currentDir.includes("/dist/")) {
        // From node_modules/@becklyn/components/dist/cli/ -> ../../styles/
        // The styles directory is at the package root level
        return path.join(__dirname, "../../styles");
    } else {
        // Running from source code during development
        return path.join(__dirname, "../styles");
    }
};

const copyStylesFiles = async (targetDir: string) => {
    const stylesSourceDir = getStylesPath();
    const stylesTargetDir = path.join(targetDir, "styles");

    try {
        // Create the styles directory if it doesn't exist
        if (!fs.existsSync(stylesTargetDir)) {
            fs.mkdirSync(stylesTargetDir, { recursive: true });
        }

        // Recursively copy all contents from styles directory
        await copyDirectoryContents(stylesSourceDir, stylesTargetDir, "");

        console.log("✅ Styles files copied successfully!");
    } catch (error) {
        console.error("❌ Error copying styles files:", error);
        throw error;
    }
};

const copyDirectoryContents = async (
    sourceDir: string,
    targetDir: string,
    relativePath: string
) => {
    const items = fs.readdirSync(sourceDir);

    for (const item of items) {
        const sourcePath = path.join(sourceDir, item);
        const targetPath = path.join(targetDir, item);
        const displayPath = relativePath ? path.join(relativePath, item) : item;
        const stat = fs.statSync(sourcePath);

        if (stat.isDirectory()) {
            // Create directory if it doesn't exist
            if (!fs.existsSync(targetPath)) {
                fs.mkdirSync(targetPath, { recursive: true });
            }
            // Recursively copy directory contents
            await copyDirectoryContents(sourcePath, targetPath, displayPath);
        } else if (stat.isFile()) {
            // Check if file already exists at target location
            if (fs.existsSync(targetPath)) {
                console.log(`   ⏭️  Skipped ${displayPath} (already exists)`);
            } else {
                fs.copyFileSync(sourcePath, targetPath);
                console.log(`   ✅  Copied ${displayPath}`);
            }
        }
    }
};

const assertDependencies = async (
    packageJson: {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
    },
    dependencies: string[]
) => {
    for (const dependency of dependencies) {
        if (!hasAnyDependency(packageJson, dependency)) {
            console.error(`❌ Dependency ${dependency} is not installed in this project`);
            console.error(`💡 Please install ${dependency} first`);
            process.exit(1);
        }
    }
};

const ensureDependencies = async (
    packageJson: {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
    },
    dependencies: string[],
    devDependencies: string[]
) => {
    for (const dependency of dependencies) {
        if (!hasDependency(packageJson, dependency)) {
            await execAsync(`npm install ${dependency}`);
        }
    }

    for (const devDependency of devDependencies) {
        if (!hasDevDependency(packageJson, devDependency)) {
            await execAsync(`npm install --save-dev ${devDependency}`);
        }
    }
};

const hasAnyDependency = (
    packageJson: {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
    },
    dependency: string
) => {
    return (
        (packageJson.dependencies && packageJson.dependencies[dependency]) ||
        (packageJson.devDependencies && packageJson.devDependencies[dependency])
    );
};

const hasDevDependency = (
    packageJson: {
        devDependencies?: Record<string, string>;
    },
    dependency: string
) => {
    return packageJson.devDependencies && packageJson.devDependencies[dependency];
};

const hasDependency = (
    packageJson: {
        dependencies?: Record<string, string>;
    },
    dependency: string
) => {
    return packageJson.dependencies && packageJson.dependencies[dependency];
};
