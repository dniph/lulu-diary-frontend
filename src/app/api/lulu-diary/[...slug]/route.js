import { NextResponse } from 'next/server';
import { apiFetch } from '@/lib/api-helper'

async function handler(request, { params }) {
  // Reconstruct the path to be forwarded to the backend API
  const parameters = await params;

  const path = `/${parameters.slug.join('/')}`;
  const search = request.nextUrl.search; // Preserve query parameters
  const fullPath = `${path}${search}`;

  const options = {
    method: request.method,
  };

  // Only include a body for relevant HTTP methods
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      // Check if the request has a body before trying to parse it
      const contentLength = request.headers.get('content-length') || '0';
      if (parseInt(contentLength, 10) > 0) {
        const body = await request.json();
        options.body = JSON.stringify(body);
      }
    } catch (error) {
      // This can happen if the body is not valid JSON or empty.
      // We can ignore it and let the backend handle the empty body.
      console.error('Could not parse request body:', error);
    }
  }

  try {
    // Use our centralized apiFetch helper
    const res = await apiFetch(fullPath, options);
    const data = await res.text(); // Read as text to handle all response types

    // Forward the response status and headers from the backend
    const responseHeaders = {};
    res.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    // Try to parse as JSON, but fall back to text if it fails
    try {
      return NextResponse.json(JSON.parse(data), { 
        status: res.status,
        headers: responseHeaders
      });
    } catch (e) {
      return new NextResponse(data, { 
        status: res.status,
        headers: responseHeaders
      });
    }

  } catch (error) {
    return NextResponse.json({ message: `Internal proxy error: ${error.message}` }, { status: 500 });
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };
