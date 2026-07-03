import { z } from "zod";

const bunUserSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "operator", "viewer"]),
  active: z.boolean().default(true),
});

export type BunUser = z.infer<typeof bunUserSchema>;

export const parseBunUser = (input: unknown): BunUser => {
  return bunUserSchema.parse(input);
};
