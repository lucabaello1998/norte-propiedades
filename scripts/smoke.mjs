const base = (process.env.BASE_URL ?? "http://localhost:3105").replace(/\/$/, "");

let failed = 0;

async function check(name, path, validate) {
  try {
    const response = await fetch(`${base}${path}`, { redirect: "manual" });
    const body = response.headers.get("content-type")?.includes("application/json")
      ? await response.json()
      : await response.text();
    const ok = await validate(response, body);
    console.log(`${ok ? "OK " : "FAIL"} ${name} (${response.status})`);
    if (!ok) failed += 1;
  } catch (error) {
    console.log(`FAIL ${name}: ${error.message}`);
    failed += 1;
  }
}

await check("health", "/api/health", (response, body) => response.ok && body.ok === true);
await check(
  "propiedades",
  "/api/properties?limit=5",
  (response, body) => response.ok && Array.isArray(body.items) && body.items.length > 0,
);
await check(
  "barrios",
  "/api/neighborhoods",
  (response, body) => response.ok && Array.isArray(body.items) && body.items.length > 0,
);
await check(
  "detalle",
  "/api/properties/casa-en-el-palomar",
  (response, body) => response.ok && body.slug === "casa-en-el-palomar",
);
await check(
  "admin protegido",
  "/api/admin/properties",
  (response) => response.status === 401,
);
await check("home", "/", (response, body) => response.ok && String(body).includes("Norte Propiedades"));
await check("panel", "/admin/login", (response, body) => response.ok && String(body).includes("Panel de gestión"));

if (failed > 0) {
  console.error(`\n${failed} chequeo(s) fallaron contra ${base}`);
  process.exit(1);
}

console.log(`\nTodo OK contra ${base}`);
