import type { Config } from "drizzle-kit";

export default {

  schema: "./adapter/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "expo", // <--- very important
} satisfies Config;
