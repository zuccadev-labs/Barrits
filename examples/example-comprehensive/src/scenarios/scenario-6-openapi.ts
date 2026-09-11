/**
 * Scenario 6: OpenAPI — Generate OpenAPI v3.1 schemas from trait metadata.
 */

import { generateOpenApiSchema } from "@zuccadev-labs/barrits/schema/openapi";
import { createTraitDescriptor } from "@zuccadev-labs/barrits/sdk";

export function scenario6OpenAPI() {
  console.log("\n=== SCENARIO 6: OPENAPI SCHEMA ===\n");

  const apiTrait = createTraitDescriptor({
    name: "api-gateway",
    provides: ["http:listen", "http:route"],
    metadata: {
      "http:method": "GET",
      "http:path": "/api/users",
      "http:response-type": "application/json",
    },
    create: async () => ({
      listen: async (port: number) => {},
      route: async () => {},
    }),
  });

  console.log("📄 Trait with OpenAPI tags:");
  console.log(`   Name: ${apiTrait.name}`);
  console.log(`   Method: ${(apiTrait.metadata as Record<string, unknown>)["http:method"]}`);
  console.log(`   Path: ${(apiTrait.metadata as Record<string, unknown>)["http:path"]}`);

  try {
    const schema = generateOpenApiSchema([apiTrait], {
      title: "Comprehensive Example API",
      version: "0.1.0",
    });

    console.log("\n✅ OpenAPI schema generated");
    console.log(`   Title: ${schema.info.title}`);
    console.log(`   Version: ${schema.info.version}`);
    console.log(`   Paths: ${Object.keys(schema.paths || {}).length}`);
  } catch (error) {
    console.log("\n⚠️  OpenAPI generation (demo mode)");
  }
}
