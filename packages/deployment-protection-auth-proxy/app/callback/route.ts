import { handleAuthProxyCallback } from "@becklyn/deployment-protection";

export function GET(request: Request): Promise<Response> {
    return handleAuthProxyCallback(request);
}
