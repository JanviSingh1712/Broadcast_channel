/**
 * auth.service.js
 * All authentication API calls.
 * Swap mock blocks with real apiClient calls when backend is ready.
 */
import { MOCK_USERS, addMockUser } from '@/lib/mockData';
import { simulateDelay } from '@/lib/apiClient';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

const authService = {
  /**
   * Authenticate user.
   * Real → POST /api/auth/login  { email, password }
   */
  login: async (email, password) => {
    await simulateDelay();
    // ─── MOCK ───────────────────────────────────────────
    const user = MOCK_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) throw new Error('Invalid email or password');
    const { password: _, ...safe } = user;
    const token = `mock_jwt_${user.id}_${Date.now()}`;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(safe));
    return { user: safe, token };
    // ─── REAL ────────────────────────────────────────────
    // const { user, token } = await apiClient.post('/api/auth/login', { email, password });
    // localStorage.setItem(TOKEN_KEY, token);
    // localStorage.setItem(USER_KEY, JSON.stringify(user));
    // return { user, token };
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    try { return JSON.parse(localStorage.getItem(USER_KEY)) || null; }
    catch { return null; }
  },

  getToken: () =>
    typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null,

  isAuthenticated: () =>
    !!(authService.getToken() && authService.getCurrentUser()),

  /**
   * Register a new user.
   * Real → POST /api/auth/register  { name, email, password, role }
   */
  register: async ({ name, email, password, role }) => {
    await simulateDelay();
    // ─── MOCK ───────────────────────────────────────────
    const exists = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) throw new Error('An account with this email already exists');

    const initials = name
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const colors = ['#5B5EF5', '#FF6B6B', '#C6F135', '#FFB347', '#7585fd'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role,
      initials,
      color,
    };

    addMockUser(newUser);
    const { password: _, ...safe } = newUser;
    const token = `mock_jwt_${newUser.id}_${Date.now()}`;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(safe));
    return { user: safe, token };
    // ─── REAL ────────────────────────────────────────────
    // const { user, token } = await apiClient.post('/api/auth/register', { name, email, password, role });
    // localStorage.setItem(TOKEN_KEY, token);
    // localStorage.setItem(USER_KEY, JSON.stringify(user));
    // return { user, token };
  },
};

export default authService;
