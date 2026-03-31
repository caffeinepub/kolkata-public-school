import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  GraduationCap,
  Loader2,
  Phone,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const ROLES = [
  {
    id: "teacher",
    label: "Teacher",
    desc: "Access class schedules, homework & student records",
    color: "#1F7E7A",
    icon: <BookOpen className="h-8 w-8" />,
    href: "/portal/teacher",
  },
  {
    id: "admin",
    label: "Administrator",
    desc: "Full school management access",
    color: "#2D6FA3",
    icon: <Building2 className="h-8 w-8" />,
    href: "/portal/admin",
  },
  {
    id: "reception",
    label: "Reception",
    desc: "Manage visitors, fees & quick lookups",
    color: "#238C86",
    icon: <Phone className="h-8 w-8" />,
    href: "/portal/reception",
  },
  {
    id: "student",
    label: "Student / Parent",
    desc: "View timetables, results, fees & homework",
    color: "#2B6AA6",
    icon: <GraduationCap className="h-8 w-8" />,
    href: "/portal/student",
  },
];

export default function LoginPage() {
  const defaultRole =
    new URLSearchParams(window.location.search).get("role") || null;
  const [selectedRole, setSelectedRole] = useState<string | null>(defaultRole);
  const { login, loginStatus, identity, isLoginSuccess } =
    useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoginSuccess && selectedRole) {
      const role = ROLES.find((r) => r.id === selectedRole);
      if (role) navigate({ to: role.href });
    }
  }, [isLoginSuccess, selectedRole, navigate]);

  const handleLogin = async () => {
    if (!selectedRole) return;
    await login();
  };

  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#F3EAD7" }}
    >
      {/* Header */}
      <header
        className="px-6 py-4 flex items-center gap-4"
        style={{ background: "#F6EEDD" }}
      >
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: "#0E2E40" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Homepage
        </Link>
        <div className="flex-1" />
        <img
          src="/assets/generated/kps-crest-transparent.dim_120x120.png"
          alt="KPS"
          className="h-8 w-8 object-contain"
        />
        <span
          className="text-sm font-bold"
          style={{ fontFamily: "'Playfair Display', serif", color: "#0E2E40" }}
        >
          Kolkata Public School
        </span>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <div className="text-center mb-10">
            <h1
              className="text-4xl font-bold mb-2"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#0E2E40",
              }}
            >
              Portal Login
            </h1>
            <p className="text-sm" style={{ color: "#5A4F43" }}>
              Select your role to continue to the secure portal
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {ROLES.map((role) => (
              <button
                type="button"
                key={role.id}
                data-ocid={`login.${role.id}.button`}
                onClick={() => setSelectedRole(role.id)}
                className={`rounded-xl p-5 text-left transition-all duration-200 border-2 ${
                  selectedRole === role.id
                    ? "border-[#C9A45A] shadow-portal scale-[1.02]"
                    : "border-transparent hover:border-gray-200 shadow-card"
                } bg-white`}
              >
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${role.color}22`, color: role.color }}
                >
                  {role.icon}
                </div>
                <div
                  className="font-bold text-sm mb-1"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "#0E2E40",
                  }}
                >
                  {role.label}
                </div>
                <div
                  className="text-xs leading-relaxed"
                  style={{ color: "#5A4F43" }}
                >
                  {role.desc}
                </div>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-card text-center">
            {selectedRole ? (
              <div className="mb-4">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-white mb-2"
                  style={{
                    background: ROLES.find((r) => r.id === selectedRole)?.color,
                  }}
                >
                  {ROLES.find((r) => r.id === selectedRole)?.label}
                </div>
                <p className="text-sm" style={{ color: "#5A4F43" }}>
                  Sign in securely using Internet Identity
                </p>
              </div>
            ) : (
              <p className="text-sm mb-4" style={{ color: "#5A4F43" }}>
                Please select your role above, then sign in.
              </p>
            )}

            <Button
              data-ocid="login.submit.button"
              onClick={handleLogin}
              disabled={!selectedRole || isLoggingIn}
              className="w-full h-12 text-sm font-semibold rounded-xl text-white"
              style={{ background: selectedRole ? "#0E2E40" : undefined }}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Connecting...
                </>
              ) : (
                "Sign In with Internet Identity"
              )}
            </Button>

            {identity && (
              <p className="text-xs mt-3" style={{ color: "#5A4F43" }}>
                Connected as: {identity.getPrincipal().toString().slice(0, 16)}…
              </p>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
