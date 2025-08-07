import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

const requiredPeerDependencies = ["next", "react", "react-dom", "@types/react", "@types/react-dom"];
const devDependencies = ["sass", "typescript"];
const dependencies = ["zod", "clsx", "@becklyn/next"];

export async function init() {
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
        console.log("✅ Project initialized successfully!");
        console.log(`
🎉 You can now add components with:
   npx becklyn-components add <component>
`);
    } catch (error) {
        console.error("❌ Error during initialization:", error);
        process.exit(1);
    }
}

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
