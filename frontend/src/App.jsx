import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { Layout } from './components/Layout.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { HabitsPage } from './pages/HabitsPage.jsx';
import { HabitDetailPage } from './pages/HabitDetailPage.jsx';
function Protected() { const { user, loading } = useAuth(); if (loading) return <main className="grid min-h-screen place-items-center bg-stone-50"><div className="flex items-center gap-3 text-sm font-semibold text-slate-600" role="status"><span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-100 border-t-mint"/>Loading Habitly…</div></main>; return user ? <Layout /> : <Navigate to="/login" replace />; }
export default function App() { return <Routes><Route path="/login" element={<AuthPage/>}/><Route path="/register" element={<AuthPage register/>}/><Route element={<Protected/>}><Route path="/" element={<DashboardPage/>}/><Route path="/habits" element={<HabitsPage/>}/><Route path="/habits/:id" element={<HabitDetailPage/>}/><Route path="/archived" element={<HabitsPage archived/>}/></Route></Routes>; }
