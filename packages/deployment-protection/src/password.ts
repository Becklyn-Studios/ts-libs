import { timingSafeEqualString } from "./crypto";
import type { DeploymentProtectionConfig } from "./types";

export async function validatePasswordCredentials(
    config: DeploymentProtectionConfig,
    username: string,
    password: string
): Promise<boolean> {
    if (!config.username || !config.password) {
        return false;
    }

    const userOk = await timingSafeEqualString(username, config.username);
    const passOk = await timingSafeEqualString(password, config.password);
    return userOk && passOk;
}
