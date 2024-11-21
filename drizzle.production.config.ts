import { defineConfig } from "drizzle-kit";
import { loadEnvFile } from "node:process";
import { object, parse, string } from "valibot";

loadEnvFile(".env.production.local");

const dbCredentials = parse(
	object({
		DB_NAME: string(),
		DB_HOST: string(),
		DB_USERNAME: string(),
		DB_PASSWORD: string(),
	}),
	process.env,
);

export default defineConfig({
	dialect: "postgresql",
	schema: "./drizzle/schema.ts",
	out: "./drizzle",
	dbCredentials: {
		url: `postgres://${dbCredentials.DB_USERNAME}:${dbCredentials.DB_PASSWORD}@${dbCredentials.DB_HOST}:5432/${dbCredentials.DB_NAME}?sslmode=require`,
	},
	casing: "snake_case",
});
