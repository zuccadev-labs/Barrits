/**
 * [EN] API Gateway trait. Depends on cache and data layers, provides HTTP endpoints.
 * [ES] Trait de API Gateway. Depende de capas de caché y datos, proporciona endpoints HTTP.
 */

export interface ApiGatewayContract {
  listen: (port: number) => Promise<void>;
  route: (method: string, path: string, handler: (req: unknown) => Promise<unknown>) => void;
  close: () => Promise<void>;
}

/**
 * [EN] API Gateway Trait Definition
 * [ES] Definición del Trait de API Gateway
 *
 * @trait
 * @name api-gateway
 * @requires ["db:query", "cache:get", "cache:set"]
 * @provides ["http:listen", "http:route"]
 * @state { routes: Map<string, RouteHandler>, server: ServerInstance | null }
 */
export const createApiGatewayTrait = () => ({
  name: "api-gateway",
  requires: ["db:query", "cache:get", "cache:set"],
  provides: ["http:listen", "http:route"],
  state: {
    routes: new Map() as Map<string, unknown>,
    server: null,
  },
  create: async (state: Record<string, unknown>) => {
    const routes = state.routes as Map<string, unknown>;

    return {
      listen: async (port: number) => {
        console.log(`[api-gateway] listening on port ${port}`);
      },
      route: (method: string, path: string, handler: (req: unknown) => Promise<unknown>) => {
        const key = `${method}:${path}`;
        routes.set(key, handler);
        console.log(`[api-gateway] registered route: ${key}`);
      },
      close: async () => {
        console.log("[api-gateway] closing server");
      },
    };
  },
});
