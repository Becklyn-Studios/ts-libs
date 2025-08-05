import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

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
        const hasNextJs =
            (packageJson.dependencies && packageJson.dependencies.next) ||
            (packageJson.devDependencies && packageJson.devDependencies.next);

        if (!hasNextJs) {
            console.error("❌ Next.js is not installed in this project");
            console.error("💡 Please install Next.js first");
            process.exit(1);
        }

        console.log("✅ Next.js detected");

        // Add dependencies
        if (fs.existsSync(packageJsonPath)) {
            console.log("📦 Installing dependencies...");

            // Install required dependencies
            await execAsync("npm install --save-dev sass typescript @types/react @types/react-dom");
            await execAsync("npm install react react-dom zod clsx @becklyn/next");

            console.log("✅ Dependencies installed!");
        }

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
