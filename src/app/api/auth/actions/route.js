import { auth } from '../../../../lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { action, email, password, provider } = await request.json();

  try {
    let result;
    switch (action) {
      case 'login':
        result = await auth.login({ email, password });
        break;
      case 'signup':
        result = await auth.signup({ email, password });
        break;
      case 'socialLogin':
        if (!provider) {
          return NextResponse.json({ message: 'Provider is required for social login' }, { status: 400 });
        }
        result = await auth.socialLogin(provider);
        break;
      default:
        return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Auth API route error:', error);
    return NextResponse.json({ message: error.message || 'Authentication failed' }, { status: 400 });
  }
}
