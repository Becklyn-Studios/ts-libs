import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

export const requiredPeerDependencies = [
    "next",
    "react",
    "react-dom",
    "@types/react",
    "@types/react-dom",
    "@storybook/nextjs-vite",
];
export const devDependencies = ["sass", "typescript"];
export const dependencies = ["clsx", "@becklyn/next"];

const installHints = {
    next: "💡 To install Next.js please have a look at https://nextjs.org/docs/app/getting-started/installation",
    "@types/react": "💡 To install @types/react run: npm i -D @types/react",
    "@types/react-dom": "💡 To install @types/react-dom run: npm i -D @types/react-dom",
    "@storybook/nextjs-vite": "💡 To install @storybook run: npm create storybook@latest",
};

type PackageJson = {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
};

export const loadPackageJson = (): PackageJson => {
    const cwd = process.cwd();

    // Check if package.json exists
    const packageJsonPath = path.join(cwd, "package.json");
    if (!fs.existsSync(packageJsonPath)) {
        console.error("❌ No package.json found in current directory");
        process.exit(1);
    }

    // Check if Next.js is installed
    return JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
};

export const assertDependencies = (packageJson: PackageJson, dependencies: string[]) => {
    for (const dependency of dependencies) {
        if (!hasAnyDependency(packageJson, dependency)) {
            console.error(`❌ Dependency ${dependency} is not installed in this project`);
            console.error(`💡 Please install ${dependency} first`);

            const hint = installHints[dependency as keyof typeof installHints];
            if (hint) {
                console.error(hint);
            }

            process.exit(1);
        }
    }
};

export const ensureDependencies = async (
    packageJson: PackageJson,
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

const hasAnyDependency = (packageJson: PackageJson, dependency: string) => {
    return (
        (packageJson.dependencies && packageJson.dependencies[dependency]) ||
        (packageJson.devDependencies && packageJson.devDependencies[dependency])
    );
};

const hasDevDependency = (packageJson: PackageJson, dependency: string) => {
    return packageJson.devDependencies && packageJson.devDependencies[dependency];
};

const hasDependency = (packageJson: PackageJson, dependency: string) => {
    return packageJson.dependencies && packageJson.dependencies[dependency];
};
