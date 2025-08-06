import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from 'pg';

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.POSTGRES_URL,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    nextCookies()
  ],
});