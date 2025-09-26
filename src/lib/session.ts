import { getServerSession } from 'next-auth';

import { authOptions } from './auth';

export async function getCurrentSession() {
  return getServerSession(authOptions);
}
