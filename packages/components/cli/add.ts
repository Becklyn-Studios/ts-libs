import * as fs from "fs";
import * as path from "path";
import { getAvailableComponents, getComponent } from "./registry";

interface AddOptions {
    yes?: boolean;
    overwrite?: boolean;
    components?: string;
}

export const add = async (components: string[], options: AddOptions) => {
    console.log(`🔥 Adding components: ${components.join(", ")}\n`);

    const cwd = process.cwd();
    const componentsDir = path.join(cwd, options.components || "components");

    try {
        for (const componentName of components) {
            const componentConfig = getComponent(componentName);

            if (!componentConfig) {
                console.log(
                    `❌ Component "${componentName}" not found. Available components: ${getAvailableComponents().join(", ")}`
                );
                continue;
            }

            console.log(`📦 Adding ${componentConfig.name}...`);

            // Create component files
            for (const file of componentConfig.files) {
                const filePath = path.join(componentsDir, file.path);
                const fileDir = path.dirname(filePath);

                // Create directory if it doesn't exist
                await fs.promises.mkdir(fileDir, { recursive: true });

                // Check if file exists and handle overwrite
                if (fs.existsSync(filePath) && !options.overwrite) {
                    console.log(`⚠️  ${file.path} already exists. Use --overwrite to replace it.`);
                    continue;
                }

                await fs.promises.writeFile(filePath, file.content);
                console.log(`✅ Created ${file.path}`);
            }

            console.log(`🎉 Successfully added ${componentConfig.name}!`);
        }

        console.log(`
📁 Components added to: ${componentsDir}
`);
    } catch (error) {
        console.error("❌ Error adding components:", error);
        process.exit(1);
    }
};
