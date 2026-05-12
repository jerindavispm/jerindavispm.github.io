import { useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Lock, Mail, ArrowRight, ShieldAlert } from "lucide-react";
import { useAuth } from "../lib/AuthContext";

export default function AdminLogin() {
  const { user, ready, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!ready) return null;
  if (user) {
    const to = location.state?.from || "/admin";
    return <Navigate to={to} replace />;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signIn(email.trim(), password);
      const to = location.state?.from || "/admin";
      navigate(to, { replace: true });
    } catch (err) {
      setError(err?.message || "Sign in failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0c] text-zinc-100 overflow-hidden">
      <div className="aurora" />
      <div className="absolute inset-0 hairline-grid opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0c]" />

      <div className="relative grid place-items-center min-h-screen px-5">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          <div className="glass-strong rounded-3xl p-7 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid place-items-center h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-sky-500 text-white text-[14px] font-semibold shadow-lg shadow-indigo-500/40">
                JD
              </span>
              <div>
                <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-zinc-500">Portfolio Admin</div>
                <div className="text-[18px] tracking-tight text-zinc-50 leading-tight">Sign in</div>
              </div>
            </div>

            <form onSubmit={onSubmit} className="mt-7 space-y-3.5">
              <label className="block">
                <span className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-zinc-500">Email</span>
                <div className="mt-1.5 relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" strokeWidth={1.7} />
                  <input
                    type="email"
                    autoComplete="username"
                    autoFocus
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-[14px] text-zinc-100 placeholder-zinc-600 outline-none focus:border-violet-400/40 focus:bg-white/[0.06] transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-zinc-500">Password</span>
                <div className="mt-1.5 relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" strokeWidth={1.7} />
                  <input
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-[14px] text-zinc-100 placeholder-zinc-600 outline-none focus:border-violet-400/40 focus:bg-white/[0.06] transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </label>

              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2.5 text-[12.5px] text-red-200">
                  <ShieldAlert size={14} className="mt-0.5 shrink-0" strokeWidth={1.7} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="shimmer mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white text-zinc-950 px-4 py-3 text-[14px] font-medium hover:bg-zinc-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {busy ? "Signing in…" : "Sign in"}
                {!busy && <ArrowRight size={15} />}
              </button>
            </form>

            <p className="mt-5 text-[11.5px] font-mono uppercase tracking-[0.18em] text-zinc-500 text-center">
              Authorized access only · Supabase Auth
            </p>
          </div>

          <a
            href="/"
            className="mt-5 block text-center text-[12.5px] text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← back to portfolio
          </a>
        </motion.div>
      </div>
    </div>
  );
}
