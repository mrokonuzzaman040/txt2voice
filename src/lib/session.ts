import { getServerSession } from 'next-auth';

import { authOptions } from './auth';

export async function getCurrentSession() {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}
