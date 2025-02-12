import { cookies } from 'next/headers';

const set = async (key: string, value: string, expiresAt: number) => {
  const cookieStore = await cookies();

  cookieStore.set(key, value, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
};

const get = async (key: string) => {
  const cookieStore = await cookies();

  return cookieStore.get(key)?.value;
};

const remove = async (key: string) => {
  const cookieStore = await cookies();

  cookieStore.delete(key);
};

const cookiesLib = {
  set,
  get,
  remove,
};

export default cookiesLib;
