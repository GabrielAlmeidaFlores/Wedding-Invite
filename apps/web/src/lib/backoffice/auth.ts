import { DEFAULT_WEDDING_ID } from '@/lib/backoffice/seed';
import type { SessionUser, UserRole } from '@/lib/backoffice/types';

export const SESSION_KEY = 'enlace.backoffice.session';

type DemoUser = SessionUser & { password: string };

const DEMO_USERS: readonly DemoUser[] = [
  {
    id: 'user-admin',
    name: 'Administrador',
    email: 'admin@enlace.dev',
    password: 'enlace-admin',
    role: 'admin',
    weddingId: DEFAULT_WEDDING_ID,
  },
  {
    id: 'user-cerimonial',
    name: 'Cerimonialista',
    email: 'cerimonial@enlace.dev',
    password: 'enlace-cerimonial',
    role: 'ceremonialist',
    weddingId: DEFAULT_WEDDING_ID,
  },
];

export const demoCredentials = {
  admin: { email: DEMO_USERS[0]?.email ?? '', password: DEMO_USERS[0]?.password ?? '' },
  ceremonialist: { email: DEMO_USERS[1]?.email ?? '', password: DEMO_USERS[1]?.password ?? '' },
};

function toSession(user: DemoUser): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    weddingId: user.weddingId,
  };
}

export function authenticate(email: string, password: string): SessionUser | null {
  const match = DEMO_USERS.find(
    (user) => user.email.toLowerCase() === email.trim().toLowerCase() && user.password === password,
  );
  return match ? toSession(match) : null;
}

export function readSession(): SessionUser | null {
  if (typeof sessionStorage === 'undefined') return null;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const value = parsed as Partial<SessionUser>;
    if (
      typeof value.id !== 'string' ||
      typeof value.name !== 'string' ||
      typeof value.email !== 'string' ||
      typeof value.weddingId !== 'string' ||
      (value.role !== 'admin' && value.role !== 'ceremonialist')
    ) {
      return null;
    }
    return {
      id: value.id,
      name: value.name,
      email: value.email,
      role: value.role,
      weddingId: value.weddingId,
    };
  } catch {
    return null;
  }
}

export function writeSession(user: SessionUser) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function roleLabel(role: UserRole): string {
  return role === 'admin' ? 'Administrador' : 'Cerimonialista';
}
