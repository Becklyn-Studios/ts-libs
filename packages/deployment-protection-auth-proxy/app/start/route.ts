import { handleAuthProxyStart } from "@becklyn/deployment-protection";

export function GET(request: Request): Promise<Response> {
    return handleAuthProxyStart(request);
}
