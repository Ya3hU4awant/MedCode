import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, Mail, ArrowRight, Eye, EyeOff, Activity, Pill } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === "PHARMACIST") {
        navigate("/pharmacist/dashboard");
      } else if (user.role === "GOVERNMENT") {
        navigate("/government/dashboard");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#F5F8FC] overflow-hidden">
      {/* LEFT SIDE - VISUAL AREA */}
      <div className="hidden lg:flex relative flex-col justify-between bg-gradient-to-br from-[#0B1F3A] to-[#1769E0] p-12 overflow-hidden text-white">

        {/* Abstract shapes / patterns */}
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-white opacity-[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[600px] h-[600px] bg-[#19B5D8] opacity-[0.05] rounded-full blur-3xl pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="z-10 relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
              <ShieldCheck className="text-[#19B5D8]" size={28} />
            </div>
            <span className="text-2xl font-bold tracking-tight">Med<span className="text-[#19B5D8]">Code</span></span>
          </div>

          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight mb-6 max-w-xl">
            Smarter medicine availability.<br />
            Stronger public health.
          </h1>
          <p className="text-lg text-white/80 max-w-md leading-relaxed">
            Connect pharmacies, instantly detect medicine shortages, and empower authorities to respond faster anywhere in the state.
          </p>
        </motion.div>

        {/* Floating Glass Cards */}
        <div className="z-10 relative mt-16 max-w-lg h-[300px] w-full" style={{ perspective: "1000px" }}>
          <motion.div
            initial={{ opacity: 0, x: -50, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute top-0 left-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-2xl flex items-center gap-4 w-[280px]"
          >
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <Activity className="text-red-400" size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-0.5">Critical Shortages</p>
              <p className="text-3xl font-bold">03</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="absolute top-[35%] right-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-2xl flex items-center gap-4 w-[280px]"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Building2 className="text-emerald-400" size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-0.5">Pharmacies Monitored</p>
              <p className="text-3xl font-bold">128</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="absolute bottom-[-10%] left-[10%] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-2xl flex items-center gap-4 w-[280px]"
          >
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <Pill className="text-cyan-400" size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-0.5">Medicines Tracked</p>
              <p className="text-3xl font-bold">2,450</p>
            </div>
          </motion.div>
        </div>

        <div className="z-10 relative mt-auto flex justify-between items-center text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} MedCode System</p>
          <p>Hackathon Ready Demo</p>
        </div>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="flex flex-col justify-center px-6 py-12 lg:px-24 xl:px-32 relative">
        {/* Mobile Logo */}
        <div className="flex lg:hidden items-center gap-2 mb-10 w-fit self-center">
          <div className="w-10 h-10 bg-[#0B1F3A] rounded-xl flex items-center justify-center">
            <ShieldCheck className="text-[#19B5D8]" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#0B1F3A]">Med<span className="text-[#19B5D8]">Code</span></span>
        </div>

        <motion.div
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">Welcome back</h2>
            <p className="text-[#64748B] mt-2 font-medium">Sign in to your MedCode workspace</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] px-4 py-3 text-sm font-medium flex items-center gap-2 shadow-sm">
              <Activity size={16} /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-2">Email Address</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] group-focus-within:text-[#1769E0] transition-colors" />
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1769E0]/20 focus:border-[#1769E0] transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-2">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] group-focus-within:text-[#1769E0] transition-colors" />
                <input
                  type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1769E0]/20 focus:border-[#1769E0] transition-all shadow-sm"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-[#1769E0] focus:ring-[#1769E0]/20 border-[#CBD5E1]" />
                <span className="text-sm font-medium text-[#64748B]">Remember me</span>
              </label>
              <button type="button" className="text-sm font-semibold text-[#1769E0] hover:text-[#0B1F3A] transition-colors">Forgot password?</button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#1769E0] hover:bg-[#0B1F3A] disabled:opacity-70 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
              {loading ? "Authenticating..." : "Sign in to Dashboard"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#64748B] text-sm">Don't have a pharmacist account?</p>
            <button onClick={() => navigate("/pharmacist/signup")} className="mt-1 font-semibold text-[#1769E0] hover:text-[#0B1F3A] transition-colors">
              Create Pharmacist Account
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}