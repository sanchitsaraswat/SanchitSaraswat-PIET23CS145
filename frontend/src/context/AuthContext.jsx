import { createContext, useContext, useEffect, useState } from 'react';
import { api, authStore } from '../api/client.js';
const AuthContext = createContext(null);
export function AuthProvider({ children }) { const [user, setUser] = useState(null); const [loading, setLoading] = useState(true); useEffect(() => { api.post('/api/auth/refresh').then((data) => { authStore.set(data.accessToken); setUser(data.user); }).catch(() => {}).finally(() => setLoading(false)); }, []); const login = async (path, data) => { const session = await api.post(path, data); authStore.set(session.accessToken); setUser(session.user); }; const logout = async () => { await api.post('/api/auth/logout'); authStore.set(null); setUser(null); }; return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>; }
export const useAuth = () => useContext(AuthContext);
