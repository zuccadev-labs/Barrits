/**
 * HTTP endpoint trait for Deno BaaS.
 *
 * Declares an HTTP API endpoint discoverable for OpenAPI schema generation.
 * Each endpoint maps to a REST resource managed by the BaaS.
 *
 * @barrits-trait http-endpoint
 * @baritr-provides http:api
 * @barrits-consumes database:connection
 * @barrits-state RequestHandler
 */
export const httpEndpointTrait = {
  name: "users-api" as const,
  provides: ["http:api"] as readonly string[],
  consumes: ["database:connection"] as readonly string[],
  state: ["RequestHandler"] as readonly string[],
  tags: ["http-endpoint"] as readonly string[],
  initialize: () => ({
    basePath: "/api/users",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
};
