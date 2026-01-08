import {
    assertDependencies,
    dependencies,
    devDependencies,
    ensureDependencies,
    loadPackageJson,
    requiredPeerDependencies,
} from "./dependencies";

export async function init() {
    console.log("🚀 Initializing @becklyn/components in your project...\n");

    try {
        const packageJson = loadPackageJson();

        assertDependencies(packageJson, requiredPeerDependencies);

        console.log("✅ All required dependencies detected");
        console.log("📦 Installing dependencies...");

        await ensureDependencies(packageJson, dependencies, devDependencies);

        console.log("✅ Dependencies installed!");
        console.log("✅ Project initialized successfully!");
        console.log(`
🎉 You can now add components with:
   npx @becklyn/components add <component>
`);
    } catch (error) {
        console.error("❌ Error during initialization:", error);
        process.exit(1);
    }
}
