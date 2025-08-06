import { auth } from '../../../../src/lib/auth'; // Adjust path as needed
import { toNodeHandler } from 'better-auth/next-js';

// This is the catch-all route for all better-auth related API calls
// e.g., /api/auth/login, /api/auth/callback, /api/auth/logout

const handler = toNodeHandler(auth.handleAuth());

export { handler as GET, handler as POST };
