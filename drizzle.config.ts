// For God so loved the world that He gave His only begotten Son...
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/server/schema_chirho.ts',
	out: './migrations',
	dialect: 'sqlite',
	driver: 'd1-http',
	dbCredentials: {
		accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
		databaseId: '2202fc9a-27e5-4302-94a0-8fe96f083e50',
		token: process.env.CLOUDFLARE_API_TOKEN!
	}
});
