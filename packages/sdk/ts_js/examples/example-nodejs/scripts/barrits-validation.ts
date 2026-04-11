import { parseOperationalUser } from "../barrits";

const payload = await parseOperationalUser({
  email: "ops@barrits.dev",
  role: "operator",
  active: true,
  ignored: "removed",
});

console.log(JSON.stringify(payload, null, 2));