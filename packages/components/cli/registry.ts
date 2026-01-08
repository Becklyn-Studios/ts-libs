import * as fs from "fs";
import * as path from "path";

export interface ComponentConfig {
    name: string;
    files: Array<{
        path: string;
        content: string;
    }>;
    dependencies: string[];
}

/**
 * Get the path to the components directory relative to this registry file
 */
function getComponentsPath(): string {
    // When running from compiled code in dist/, we need to go up more levels
    // From dist/cjs/cli/ or dist/es/cli/ to the components/ directory
    const currentDir = __dirname;

    // Check if we're running from compiled code
    if (currentDir.includes("/dist/")) {
        // From dist/cjs/cli/ -> ../../../components/
        // From dist/es/cli/ -> ../../../components/
        return path.join(__dirname, "../../../components");
    } else {
        // Running from source code
        return path.join(__dirname, "../components");
    }
}

/**
 * Check if a directory is a valid component directory
 */
function isValidComponentDir(dirPath: string): boolean {
    try {
        const tsxFile = fs.readdirSync(dirPath).find(file => file.endsWith(".tsx"));
        return tsxFile !== undefined;
    } catch {
        return false;
    }
}

/**
 * Recursively scan for components in nested directories (atoms, molecules, organisms, etc.)
 */
function scanComponentsRecursively(
    basePath: string,
    relativePath: string = ""
): Array<{ name: string; path: string }> {
    const components: Array<{ name: string; path: string }> = [];

    try {
        const entries = fs.readdirSync(basePath, { withFileTypes: true });

        for (const entry of entries) {
            if (entry.isDirectory()) {
                // Skip hidden directories (starting with .) and common non-component directories
                if (
                    entry.name.startsWith(".") ||
                    entry.name === "node_modules" ||
                    entry.name === "dist" ||
                    entry.name === "__tests__" ||
                    entry.name === "test" ||
                    entry.name === "tests"
                ) {
                    continue;
                }

                const fullPath = path.join(basePath, entry.name);
                const currentRelativePath = relativePath
                    ? `${relativePath}/${entry.name}`
                    : entry.name;

                // Check if this directory is a component directory
                if (isValidComponentDir(fullPath)) {
                    components.push({
                        name: entry.name,
                        path: currentRelativePath,
                    });
                } else {
                    // Recursively scan subdirectories (like atoms/, molecules/, etc.)
                    const nestedComponents = scanComponentsRecursively(
                        fullPath,
                        currentRelativePath
                    );
                    components.push(...nestedComponents);
                }
            }
        }
    } catch {
        // Silently ignore directories that can't be read
    }

    return components;
}

/**
 * Read all files in a component directory and return them as file objects
 */
function readComponentFiles(
    componentName: string,
    componentDir: string,
    relativePath?: string
): {
    files: Array<{ path: string; content: string }>;
    dependencies: string[];
} {
    const files: Array<{ path: string; content: string }> = [];
    const dependencies: string[] = [];

    try {
        const dirContents = fs.readdirSync(componentDir, { withFileTypes: true });

        for (const item of dirContents) {
            if (item.isFile()) {
                const filePath = path.join(componentDir, item.name);
                const content = fs.readFileSync(filePath, "utf-8");

                if (item.name.endsWith("dependencies.json")) {
                    console.log(item.name, content);
                    continue;
                }

                // Use the full relative path from components directory if provided
                const fileRelativePath = relativePath
                    ? `${relativePath}/${item.name}`
                    : `${componentName}/${item.name}`;

                files.push({
                    path: fileRelativePath,
                    content: content,
                });
            }
        }
    } catch (error) {
        console.error(`Error reading files from ${componentDir}:`, error);
    }

    return { files, dependencies };
}

export function getAvailableComponents(): string[] {
    try {
        const componentsPath = getComponentsPath();

        if (!fs.existsSync(componentsPath)) {
            console.warn(`Components directory not found at: ${componentsPath}`);
            return [];
        }

        const components = scanComponentsRecursively(componentsPath);
        return components.map(component => component.name.toLowerCase());
    } catch (error) {
        console.error("Error reading components directory:", error);
        return [];
    }
}

export function getComponent(name: string): ComponentConfig | undefined {
    try {
        const componentsPath = getComponentsPath();
        const componentName = name.toLowerCase();

        // Scan for all components and find the matching one
        const allComponents = scanComponentsRecursively(componentsPath);
        const matchingComponent = allComponents.find(
            component => component.name.toLowerCase() === componentName
        );

        if (!matchingComponent) {
            return undefined;
        }

        const componentDir = path.join(componentsPath, matchingComponent.path);

        if (!isValidComponentDir(componentDir)) {
            return undefined;
        }

        // Remove any "components/" prefix from the path to avoid double nesting
        const cleanPath = matchingComponent.path.startsWith("components/")
            ? matchingComponent.path.substring("components/".length)
            : matchingComponent.path;

        const { files, dependencies } = readComponentFiles(
            matchingComponent.name,
            componentDir,
            cleanPath
        );

        return {
            name: matchingComponent.name,
            files,
            dependencies,
        };
    } catch (error) {
        console.error(`Error reading component "${name}":`, error);
        return undefined;
    }
}
