import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';

import { authOptions } from './auth';

export async function getCurrentSession() {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    console.error('Session error:', error);
    
    // If it's a JWT decryption error, clear the session token
    if (error instanceof Error && error.message.includes('decryption operation failed')) {
      console.log('JWT decryption failed, clearing session token');
      const cookieStore = cookies();
      cookieStore.delete('next-auth.session-token');
      cookieStore.delete('__Secure-next-auth.session-token');
    }
    
    return null;
  }
}
