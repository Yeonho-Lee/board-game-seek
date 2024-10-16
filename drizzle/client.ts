import { drizzle } from 'drizzle-orm/node-postgres';
import { loadEnvFile } from 'node:process';
import { Pool } from 'pg';
import { object, parse, string } from 'valibot';
import * as schema from './schema.ts';

loadEnvFile('.env.local');

const dbCredentials = parse(
	object({
		DB_NAME: string(),
		DB_USERNAME: string(),
		DB_PASSWORD: string(),
	}),
	process.env,
);

const pool = new Pool({
	connectionString: `postgres://${dbCredentials.DB_USERNAME}:${dbCredentials.DB_PASSWORD}@localhost:5432/${dbCredentials.DB_NAME}`,
});

export const db = drizzle({ client: pool, casing: 'snake_case', schema });
