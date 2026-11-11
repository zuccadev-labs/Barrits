/**
 * Scenario 6: OpenAPI — Generate an OpenAPI 3.1 document from the routes composed traits expose.
 */

import { generateOpenApiFromRoutes } from "@zuccadev-labs/barrits/schema/openapi";
import { composeTraitDescriptors, createTraitDescriptor } from "@zuccadev-labs/barrits";

export function scenario6OpenAPI() {
  console.log("\n=== SCENARIO 6: OPENAPI SCHEMA ===\n");

  // A trait exposes its HTTP routes under a capability whose key contains "routes".
  const usersTrait = createTraitDescriptor({
    name: "users-api",
    provides: ["users-routes"],
    create: () => ({
      "users-routes": [
        { method: "GET", path: "/api/users", access: "public", _openapi: { summary: "List users" } },
        { method: "GET", path: "/api/users/:id", access: "user", _openapi: { summary: "Get a user" } },
        { method: "POST", path: "/api/users", access: "admin", _openapi: { summary: "Create a user" } },
      ],
    }),
  });

  const { traits } = composeTraitDescriptors([usersTrait]);
  const schema = generateOpenApiFromRoutes(traits as Record<string, unknown>, {
    title: "Comprehensive Example API",
    version: "0.1.0",
    securitySchemes: { bearer: { type: "http", scheme: "bearer" } },
    securityFor: (route) => (route.access === "public" ? [] : [{ bearer: [] }]),
  });

  console.log("✅ OpenAPI schema generated");
  console.log(`   Title: ${schema.info.title}`);
  console.log(`   Version: ${schema.info.version}`);
  console.log(`   Paths: ${Object.keys(schema.paths).join(", ")}`);
}
