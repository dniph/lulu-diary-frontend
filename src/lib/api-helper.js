import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';

const API_URL = process.env.API_URL;
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * A centralized helper for making authenticated requests to the backend API.
 * It automatically handles session checking and JWT injection.
 *
 * @param {string} path - The API path to request (e.g., '/profiles/dniph').
 * @param {object} options - The standard `fetch` options object (method, body, etc.).
 * @returns {Promise<Response>} The response from the backend API.
 */
export async function apiFetch(path, options = {}) {
  const sessionHeaders = await headers();
  const session = await auth.api.getSession({ headers: sessionHeaders });

  const fetchHeaders = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (session && JWT_SECRET) {
    const payload = {
       sub: session.user.id,
    };
    const options = {
      expiresIn: '5m',
    };
    
    const token = jwt.sign(payload, JWT_SECRET, options);
    fetchHeaders['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_URL}${path}`;
  const finalOptions = {
    ...options,
    headers: fetchHeaders,
  };

  return fetch(url, finalOptions);
}
