import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnnouncements } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Building2,
  ChevronRight,
  Facebook,
  GraduationCap,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Music,
  Phone,
  Search,
  Trophy,
  Twitter,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const NAV_LINKS = [
  { label: "About Us", href: "#about" },
  { label: "Academics", href: "#academics" },
  { label: "Admissions", href: "#admissions" },
  { label: "Life at KPS", href: "#life" },
  { label: "Announcements", href: "#announcements" },
  { label: "Contact", href: "#contact" },
];

const PORTAL_TILES = [
  {
    role: "Teachers",
    desc: "Manage classes, homework, timetables and student records.",
    color: "bg-[#1F7E7A]",
    href: "/portal/login?role=teacher",
    icon: <BookOpen className="h-8 w-8 text-white" />,
  },
  {
    role: "Admin",
    desc: "Full school administration, fees, staff, results & documents.",
    color: "bg-[#2D6FA3]",
    href: "/portal/login?role=admin",
    icon: <Building2 className="h-8 w-8 text-white" />,
  },
  {
    role: "Reception",
    desc: "Manage visitor logs, fee status and student lookups.",
    color: "bg-[#238C86]",
    href: "/portal/login?role=reception",
    icon: <Phone className="h-8 w-8 text-white" />,
  },
  {
    role: "Students & Parents",
    desc: "View timetables, homework, exam results, fees & documents.",
    color: "bg-[#2B6AA6]",
    href: "/portal/login?role=student",
    icon: <GraduationCap className="h-8 w-8 text-white" />,
  },
];

const SAMPLE_ANNOUNCEMENTS = [
  {
    title: "Annual Sports Day 2026",
    content:
      "The Annual Sports Day will be held on 15th April 2026 at the main ground. All students must participate.",
    category: "event",
    date: "March 28, 2026",
  },
  {
    title: "Class X Board Exam Schedule",
    content:
      "The ICSE Board Examinations for Class X will commence from 20th February 2026. Admit cards are ready.",
    category: "academic",
    date: "March 25, 2026",
  },
  {
    title: "Fee Payment Deadline",
    content:
      "Q4 fee payment is due by 10th April 2026. Late fees will apply after the due date. Pay online or at reception.",
    category: "fee",
    date: "March 20, 2026",
  },
  {
    title: "Parent-Teacher Meeting",
    content:
      "PTM for Classes VI–X is scheduled for Saturday, 5th April 2026. Please collect your slot from school office.",
    category: "general",
    date: "March 18, 2026",
  },
];

const HIGHLIGHTS = [
  {
    icon: <Trophy className="h-8 w-8" />,
    label: "Academic Excellence",
    value: "98% Board Results",
  },
  {
    icon: <Building2 className="h-8 w-8" />,
    label: "Modern Facilities",
    value: "Smart Classrooms & Labs",
  },
  {
    icon: <Music className="h-8 w-8" />,
    label: "Co-Curriculars",
    value: "40+ Activities",
  },
  {
    icon: <Users className="h-8 w-8" />,
    label: "Dedicated Faculty",
    value: "120+ Teachers",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  event: "bg-purple-100 text-purple-700",
  academic: "bg-blue-100 text-blue-700",
  fee: "bg-amber-100 text-amber-700",
  general: "bg-green-100 text-green-700",
};

export default function HomePage() {
  const { data: announcements } = useAnnouncements();

  const displayAnnouncements =
    announcements && announcements.length > 0
      ? announcements.slice(0, 4).map((a) => ({
          title: a.title,
          content: a.content,
          category: Object.keys(a.category)[0],
          date: new Date(Number(a.date) / 1_000_000).toLocaleDateString(
            "en-IN",
            { day: "numeric", month: "long", year: "numeric" },
          ),
        }))
      : SAMPLE_ANNOUNCEMENTS;

  return (
    <div
      className="min-h-screen"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* HEADER */}
      <header
        className="sticky top-0 z-50 shadow-sm"
        style={{ background: "#F6EEDD" }}
      >
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img
              src="/assets/generated/kps-crest-transparent.dim_120x120.png"
              alt="KPS Crest"
              className="h-10 w-10 object-contain"
            />
            <div>
              <div
                className="text-xs tracking-widest font-semibold uppercase"
                style={{ color: "#C9A45A" }}
              >
                KPS
              </div>
              <div
                className="text-sm font-bold leading-tight"
                style={{
                  color: "#0E2E40",
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Kolkata Public School
              </div>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-[#C9A45A]"
                style={{ color: "#0E2E40" }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="hidden md:flex items-center justify-center h-9 w-9 rounded-full hover:bg-[#E8DCBF] transition-colors"
              style={{ color: "#0E2E40" }}
            >
              <Search className="h-4 w-4" />
            </button>
            <Link to="/portal/login">
              <Button
                data-ocid="nav.portal_login.button"
                className="text-white text-sm font-semibold px-5 py-2 rounded-lg"
                style={{ background: "#1F5F8A" }}
              >
                Portal Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section
        className="relative min-h-[600px] flex items-center"
        style={{
          backgroundImage: `url('/assets/generated/kps-hero-campus.dim_1400x700.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(11,28,49,0.88) 0%, rgba(11,28,49,0.55) 60%, rgba(11,28,49,0.10) 100%)",
          }}
        />
        <div className="relative max-w-[1200px] mx-auto px-6 py-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-xl"
          >
            <p
              className="text-xs tracking-[0.25em] uppercase mb-4 font-medium"
              style={{ color: "#C9A45A" }}
            >
              KOLKATA PUBLIC SCHOOL |
            </p>
            <h1
              className="text-5xl font-bold leading-tight mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#FFFFFF",
              }}
            >
              Excellence in Education,
              <br />
              Integrity in Character.
            </h1>
            <p
              className="text-base mb-8 leading-relaxed"
              style={{ color: "rgba(255,255,255,0.82)" }}
            >
              Nurturing young minds since 1962 with a commitment to holistic
              development, academic rigour, and enduring values in the heart of
              Kolkata.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#about">
                <Button
                  data-ocid="hero.discover.button"
                  className="text-sm font-semibold px-7 py-3 rounded-lg h-auto"
                  style={{ background: "#C9A45A", color: "#0E2E40" }}
                >
                  Discover KPS
                </Button>
              </a>
              <Link to="/portal/login">
                <Button
                  data-ocid="hero.apply.button"
                  variant="outline"
                  className="text-sm font-semibold px-7 py-3 rounded-lg h-auto border-white text-white hover:bg-white/10"
                >
                  Apply Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ANNOUNCEMENTS */}
      <section
        id="announcements"
        className="py-20"
        style={{ background: "#F3EAD7" }}
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <p
              className="text-xs tracking-widest uppercase font-semibold mb-2"
              style={{ color: "#C9A45A" }}
            >
              Latest Updates
            </p>
            <h2
              className="text-3xl font-bold"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#0E2E40",
              }}
            >
              Announcements & News
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayAnnouncements.map((ann, i) => (
              <motion.div
                key={ann.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Card
                  data-ocid={`announcements.item.${i + 1}`}
                  className="h-full border-0 shadow-card hover:shadow-portal transition-shadow duration-300 bg-white rounded-xl overflow-hidden"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        className={`text-xs font-medium px-2 py-0.5 ${CATEGORY_COLORS[ann.category] ?? CATEGORY_COLORS.general}`}
                      >
                        {ann.category.charAt(0).toUpperCase() +
                          ann.category.slice(1)}
                      </Badge>
                      <span className="text-xs" style={{ color: "#8A7560" }}>
                        {ann.date}
                      </span>
                    </div>
                    <CardTitle
                      className="text-base leading-snug"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        color: "#0E2E40",
                      }}
                    >
                      {ann.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p
                      className="text-sm leading-relaxed line-clamp-3"
                      style={{ color: "#4A4035" }}
                    >
                      {ann.content}
                    </p>
                    <button
                      type="button"
                      className="mt-3 flex items-center gap-1 text-xs font-semibold"
                      style={{ color: "#1F5F8A" }}
                    >
                      Read more <ChevronRight className="h-3 w-3" />
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTALS */}
      <section id="portals" className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <p
              className="text-xs tracking-widest uppercase font-semibold mb-2"
              style={{ color: "#C9A45A" }}
            >
              Secure Access
            </p>
            <h2
              className="text-3xl font-bold"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#0E2E40",
              }}
            >
              Role-Based Portals
            </h2>
            <p className="mt-2 text-sm" style={{ color: "#5A4F43" }}>
              Choose your role to access your personalised portal.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PORTAL_TILES.map((tile, i) => (
              <motion.div
                key={tile.role}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div
                  data-ocid={`portal.${tile.role.toLowerCase().replace(/[^a-z]/g, "")}.card`}
                  className={`${tile.color} rounded-2xl p-8 text-white flex flex-col gap-4 shadow-portal hover:scale-[1.02] transition-transform duration-200`}
                >
                  <div className="h-14 w-14 rounded-xl bg-white/20 flex items-center justify-center">
                    {tile.icon}
                  </div>
                  <div>
                    <h3
                      className="text-xl font-bold mb-1"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {tile.role}
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed">
                      {tile.desc}
                    </p>
                  </div>
                  <Link to={tile.href}>
                    <Button
                      data-ocid={`portal.${tile.role.toLowerCase().replace(/[^a-z]/g, "")}.button`}
                      className="w-full bg-white font-semibold text-sm rounded-lg mt-auto hover:bg-white/90"
                      style={{ color: "#0E2E40" }}
                    >
                      Login to Portal
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="py-14" style={{ background: "#0E2E40" }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {HIGHLIGHTS.map((h, i) => (
              <motion.div
                key={h.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex flex-col items-center text-center gap-3"
              >
                <div
                  className="h-14 w-14 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(201,164,90,0.18)",
                    color: "#C9A45A",
                  }}
                >
                  {h.icon}
                </div>
                <div>
                  <div
                    className="text-base font-bold text-white"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {h.label}
                  </div>
                  <div
                    className="text-xs mt-1"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    {h.value}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" style={{ background: "#0B2C3B" }}>
        <div className="max-w-[1200px] mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/assets/generated/kps-crest-transparent.dim_120x120.png"
                  alt="KPS"
                  className="h-10 w-10 object-contain"
                />
                <span
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Kolkata Public School
                </span>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Striving for excellence since 1962. An ICSE-affiliated school
                committed to holistic education in Kolkata.
              </p>
              <div className="mt-4 space-y-1.5">
                <div
                  className="flex items-center gap-2 text-sm"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>12 School Road, Ballygunge, Kolkata – 700 019</span>
                </div>
                <div
                  className="flex items-center gap-2 text-sm"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  <Phone className="h-4 w-4" />
                  <span>+91 33 2456 7890</span>
                </div>
                <div
                  className="flex items-center gap-2 text-sm"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  <Mail className="h-4 w-4" />
                  <span>info@kolkatapublicschool.edu.in</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4
                className="text-sm font-bold uppercase tracking-widest mb-4"
                style={{ color: "#C9A45A" }}
              >
                Quick Links
              </h4>
              <ul className="space-y-2">
                {[
                  "About Us",
                  "Admissions",
                  "Academics",
                  "Faculty",
                  "Examinations",
                  "Contact Us",
                ].map((l) => (
                  <li key={l}>
                    <a
                      href="/"
                      className="text-sm hover:text-white transition-colors"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4
                className="text-sm font-bold uppercase tracking-widest mb-4"
                style={{ color: "#C9A45A" }}
              >
                Connect With Us
              </h4>
              <div className="flex gap-3 mb-6">
                {[
                  { icon: <Facebook className="h-4 w-4" />, label: "Facebook" },
                  {
                    icon: <Instagram className="h-4 w-4" />,
                    label: "Instagram",
                  },
                  { icon: <Linkedin className="h-4 w-4" />, label: "LinkedIn" },
                  { icon: <Twitter className="h-4 w-4" />, label: "Twitter" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href="/"
                    className="h-9 w-9 rounded-full flex items-center justify-center transition-colors hover:bg-[#C9A45A] hover:text-[#0E2E40]"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.7)",
                    }}
                    aria-label={s.label}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
              <div
                className="rounded-xl p-4"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <p
                  className="text-xs font-semibold mb-2"
                  style={{ color: "#C9A45A" }}
                >
                  School Hours
                </p>
                <p
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  Monday – Saturday: 8:00 AM – 3:30 PM
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  Office: 9:00 AM – 5:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="border-t"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              © {new Date().getFullYear()} Kolkata Public School. All rights
              reserved.
            </p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              Built with ♥ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                className="underline hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
