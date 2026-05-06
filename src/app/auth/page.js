"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import {
  Radio,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Zap,
  UserPlus,
  LogIn,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/utils/helpers";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Max 50 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["teacher", "principal"], {
      required_error: "Please select a role",
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function FieldError({ msg }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-xs text-coral-400 font-mono">{msg}</p>;
}

function Label({ children, required }) {
  return (
    <label className="block text-[11px] font-mono text-sub uppercase tracking-wider mb-1.5">
      {children}
      {required && <span className="text-coral-400 ml-0.5">*</span>}
    </label>
  );
}

const inputCls = "input-base";
const DEMOS = [
  { label: "Teacher", email: "teacher@demo.com", color: "#5B5EF5" },
  { label: "Principal", email: "principal@demo.com", color: "#C6F135" },
];

function LoginForm({ onSwitch }) {
  const { login } = useAuth();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    setBusy(true);
    try {
      const u = await login(data.email, data.password);
      toast.success(`Welcome back, ${u.name.split(" ")[0]} ✦`);
      router.replace(`/${u.role}/dashboard`);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 animate-fade-up"
    >
      <div className="p-4 rounded-2xl bg-surface border border-border">
        <p className="text-[10px] font-mono text-faint uppercase tracking-wider mb-2.5">
          Quick demo access
        </p>
        <div className="grid grid-cols-2 gap-2">
          {DEMOS.map((d) => (
            <button
              key={d.label}
              type="button"
              onClick={() => {
                setValue("email", d.email);
                setValue("password", "password");
              }}
              className="flex items-center gap-2 p-3 rounded-xl border border-border hover:border-muted bg-card hover:bg-card/80 transition-all duration-150 text-left"
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: d.color }}
              />
              <span className="text-xs font-display font-semibold text-text">
                {d.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label required>Email address</Label>
        <input
          {...register("email")}
          type="email"
          placeholder="you@school.edu"
          className={inputCls}
          autoComplete="email"
        />
        <FieldError msg={errors.email?.message} />
      </div>

      <div>
        <Label required>Password</Label>
        <div className="relative">
          <input
            {...register("password")}
            type={showPass ? "text" : "password"}
            placeholder="••••••••"
            className={cn(inputCls, "pr-10")}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-sub transition-colors"
          >
            {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        <FieldError msg={errors.password?.message} />
      </div>

      <button type="submit" disabled={busy} className="btn-primary w-full">
        {busy ? (
          <>
            <Loader2 size={14} className="animate-spin" /> Signing in…
          </>
        ) : (
          <>
            <LogIn size={14} /> Sign In <ArrowRight size={13} />
          </>
        )}
      </button>

      <p className="text-center text-xs text-sub pt-1">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-ink-400 hover:text-ink-300 font-semibold transition-colors"
        >
          Create one
        </button>
      </p>
    </form>
  );
}

function SignupForm({ onSwitch }) {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data) => {
    setBusy(true);
    try {
      const u = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      toast.success(`Account created! Welcome, ${u.name.split(" ")[0]} 🎉`);
      router.replace(`/${u.role}/dashboard`);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 animate-fade-up"
    >
      <div>
        <Label required>Full name</Label>
        <input
          {...register("name")}
          type="text"
          placeholder="e.g. Jane Smith"
          className={inputCls}
          autoComplete="name"
        />
        <FieldError msg={errors.name?.message} />
      </div>

      <div>
        <Label required>Email address</Label>
        <input
          {...register("email")}
          type="email"
          placeholder="you@school.edu"
          className={inputCls}
          autoComplete="email"
        />
        <FieldError msg={errors.email?.message} />
      </div>

      <div>
        <Label required>Role</Label>
        <div className="relative">
          <select
            {...register("role")}
            className={cn(inputCls, "appearance-none pr-9 cursor-pointer")}
            defaultValue=""
          >
            <option value="" disabled>
              Select your role…
            </option>
            <option value="teacher">Teacher</option>
            <option value="principal">Principal</option>
          </select>
          <ChevronDown
            size={13}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-faint pointer-events-none"
          />
        </div>
        <FieldError msg={errors.role?.message} />
      </div>

      <div>
        <Label required>Password</Label>
        <div className="relative">
          <input
            {...register("password")}
            type={showPass ? "text" : "password"}
            placeholder="Min. 6 characters"
            className={cn(inputCls, "pr-10")}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-sub transition-colors"
          >
            {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        <FieldError msg={errors.password?.message} />
      </div>

      <div>
        <Label required>Confirm password</Label>
        <div className="relative">
          <input
            {...register("confirmPassword")}
            type={showConfirm ? "text" : "password"}
            placeholder="Re-enter password"
            className={cn(inputCls, "pr-10")}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-sub transition-colors"
          >
            {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        <FieldError msg={errors.confirmPassword?.message} />
      </div>

      <button type="submit" disabled={busy} className="btn-primary w-full">
        {busy ? (
          <>
            <Loader2 size={14} className="animate-spin" /> Creating account…
          </>
        ) : (
          <>
            <UserPlus size={14} /> Create Account
          </>
        )}
      </button>

      <p className="text-center text-xs text-sub pt-1">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-ink-400 hover:text-ink-300 font-semibold transition-colors"
        >
          Sign in
        </button>
      </p>
    </form>
  );
}

export default function AuthPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState("login");

  useEffect(() => {
    if (!loading && user) router.replace(`/${user.role}/dashboard`);
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-canvas flex overflow-hidden">
      <div className="orb w-96 h-96 bg-ink-500/15 -top-32 -left-32 animate-glow-pulse" />
      <div
        className="orb w-64 h-64 bg-coral/8 bottom-0 -right-20 animate-glow-pulse"
        style={{ animationDelay: "2s" }}
      />

      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-[44%] bg-surface border-r border-border relative overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-60" />
        <div className="orb w-72 h-72 bg-ink-500/20 -top-10 -right-10" />
        <div
          className="orb w-48 h-48 bg-lime-400/10 bottom-16 -left-10 animate-glow-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative z-10 flex flex-col h-full p-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ink-500 flex items-center justify-center shadow-glow-ink">
              <Radio size={18} className="text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-text text-lg tracking-tight">
                BroadcastED
              </span>
              <div className="h-px bg-gradient-to-r from-ink-500/60 to-transparent mt-0.5" />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <span className="tag bg-ink-500/15 text-ink-400 border border-ink-500/25 mb-5 w-fit">
              <Zap size={10} /> Educational Broadcasting Platform
            </span>
            <h1 className="font-display font-bold text-[2.4rem] text-text leading-[1.1] mb-4">
              Content that{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-ink-400">connects</span>
                <span className="absolute inset-x-0 bottom-1 h-3 bg-ink-500/20 -skew-x-2 z-0" />
              </span>
              <br />
              classrooms.
            </h1>
            <p className="text-sub leading-relaxed max-w-xs text-sm">
              Upload content, get it approved, and broadcast live to students —
              all in one seamless platform.
            </p>

            <div className="mt-8 space-y-3">
              {[
                {
                  role: "Teacher",
                  desc: "Upload & schedule subject content",
                  color: "#5B5EF5",
                },
                {
                  role: "Principal",
                  desc: "Approve, reject & manage all content",
                  color: "#C6F135",
                },
                {
                  role: "Student",
                  desc: "View live broadcasts — no login needed",
                  color: "#FF6B6B",
                },
              ].map((r) => (
                <div key={r.role} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold font-display text-canvas shrink-0"
                    style={{ backgroundColor: r.color }}
                  >
                    {r.role[0]}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text">
                      {r.role}
                    </span>
                    <span className="text-xs text-faint ml-2">— {r.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] font-mono text-muted">
            © 2024 BroadcastED · Made by Janvi
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 relative z-10">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-ink-500 flex items-center justify-center">
              <Radio size={14} className="text-white" />
            </div>
            <span className="font-display font-bold text-text">
              BroadcastED
            </span>
          </div>

          {/* Tab switcher */}
          <div className="flex p-1 bg-card border border-border rounded-2xl mb-7">
            {[
              { key: "login", label: "Sign In", icon: LogIn },
              { key: "signup", label: "Sign Up", icon: UserPlus },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all duration-200",
                  tab === key
                    ? "bg-ink-500 text-canvas shadow-sm"
                    : "text-sub hover:text-text hover:bg-card/50",
                )}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>

          {tab === "login" ? (
            <LoginForm onSwitch={() => setTab("signup")} />
          ) : (
            <SignupForm onSwitch={() => setTab("login")} />
          )}
        </div>
      </div>
    </div>
  );
}
