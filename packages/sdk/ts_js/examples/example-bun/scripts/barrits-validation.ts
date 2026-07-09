import { parseBunUser } from "../barrits/validation";

const payload = parseBunUser({
  email: "ops@barrits.dev",
  role: "operator",
  active: true,
});

console.log("Valid user:", JSON.stringify(payload, null, 2));

try {
  parseBunUser({ email: "bad", role: "nobody" });
} catch (err) {
  if (err instanceof Error) {
    console.log("Validation error caught:", err.message);
  }
}
