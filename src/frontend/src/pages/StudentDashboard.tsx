import { PortalSidebar } from "@/components/PortalSidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAllDocuments,
  useAnnouncements,
  useClassHomework,
  useClassTimetable,
  useStudentFeeRecords,
  useStudentResults,
} from "@/hooks/useQueries";
import {
  BarChart2,
  BookMarked,
  Clock,
  CreditCard,
  FileText,
  LayoutDashboard,
  Megaphone,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const SIDEBAR_ITEMS = [
  {
    id: "overview",
    label: "Overview",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  { id: "timetable", label: "Timetable", icon: <Clock className="h-4 w-4" /> },
  {
    id: "homework",
    label: "Homework",
    icon: <BookMarked className="h-4 w-4" />,
  },
  {
    id: "results",
    label: "Exam Results",
    icon: <BarChart2 className="h-4 w-4" />,
  },
  {
    id: "fees",
    label: "Fee Records",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    id: "announcements",
    label: "Announcements",
    icon: <Megaphone className="h-4 w-4" />,
  },
  {
    id: "documents",
    label: "Documents",
    icon: <FileText className="h-4 w-4" />,
  },
];

const SAMPLE_TIMETABLE = [
  {
    day: "Monday",
    subject: "Mathematics",
    teacher: "Mrs. Sharma",
    formClass: "X-A",
    timeSlot: "9:00 - 10:00",
  },
  {
    day: "Monday",
    subject: "Science",
    teacher: "Mr. Banerjee",
    formClass: "X-A",
    timeSlot: "10:00 - 11:00",
  },
  {
    day: "Tuesday",
    subject: "English",
    teacher: "Ms. Roy",
    formClass: "X-A",
    timeSlot: "8:00 - 9:00",
  },
  {
    day: "Wednesday",
    subject: "History",
    teacher: "Mr. Sengupta",
    formClass: "X-A",
    timeSlot: "11:00 - 12:00",
  },
  {
    day: "Thursday",
    subject: "Geography",
    teacher: "Mrs. Basu",
    formClass: "X-A",
    timeSlot: "9:00 - 10:00",
  },
];

const SAMPLE_HOMEWORK = [
  {
    subject: "Mathematics",
    description: "Complete exercises 4.1 to 4.5 from NCERT Chapter 4.",
    dueDate: BigInt(Date.now() + 86400000 * 2) * 1_000_000n,
    formClass: "X-A",
  },
  {
    subject: "Science",
    description: "Write a lab report on the electrolysis experiment.",
    dueDate: BigInt(Date.now() + 86400000 * 4) * 1_000_000n,
    formClass: "X-A",
  },
  {
    subject: "English",
    description: "Write a 500-word essay on climate change.",
    dueDate: BigInt(Date.now() + 86400000 * 3) * 1_000_000n,
    formClass: "X-A",
  },
];

const SAMPLE_RESULTS = [
  { subject: "Mathematics", marks: 92n, grade: "A+", student: "Aryan Ghosh" },
  { subject: "Science", marks: 88n, grade: "A", student: "Aryan Ghosh" },
  { subject: "English", marks: 78n, grade: "B+", student: "Aryan Ghosh" },
  { subject: "History", marks: 84n, grade: "A", student: "Aryan Ghosh" },
];

const SAMPLE_FEES = [
  {
    studentName: "Aryan Ghosh",
    amount: 15000n,
    dueDate: BigInt(Date.now() + 86400000 * 10) * 1_000_000n,
    paid: false,
    receiptNumber: "R001",
  },
  {
    studentName: "Aryan Ghosh",
    amount: 15000n,
    dueDate: BigInt(Date.now() - 86400000 * 30) * 1_000_000n,
    paid: true,
    receiptNumber: "R002",
  },
];

const GRADE_COLORS: Record<string, string> = {
  "A+": "bg-green-100 text-green-700",
  A: "bg-green-100 text-green-600",
  "B+": "bg-blue-100 text-blue-700",
  B: "bg-blue-100 text-blue-600",
  C: "bg-yellow-100 text-yellow-700",
};

export default function StudentDashboard() {
  const [active, setActive] = useState("overview");
  const [studentName, setStudentName] = useState("Aryan Ghosh");
  const [formClass, setFormClass] = useState("X-A");

  const { data: timetable, isLoading: ttLoading } =
    useClassTimetable(formClass);
  const { data: homework, isLoading: hwLoading } = useClassHomework(formClass);
  const { data: results, isLoading: resLoading } =
    useStudentResults(studentName);
  const { data: feeRecords, isLoading: feeLoading } =
    useStudentFeeRecords(studentName);
  const { data: announcements } = useAnnouncements();
  const { data: documents } = useAllDocuments();

  const displayTimetable =
    timetable && timetable.length > 0 ? timetable : SAMPLE_TIMETABLE;
  const displayHomework =
    homework && homework.length > 0 ? homework : SAMPLE_HOMEWORK;
  const displayResults =
    results && results.length > 0 ? results : SAMPLE_RESULTS;
  const displayFees =
    feeRecords && feeRecords.length > 0 ? feeRecords : SAMPLE_FEES;

  const avgMarks =
    displayResults.length > 0
      ? Math.round(
          displayResults.reduce((acc, r) => acc + Number(r.marks), 0) /
            displayResults.length,
        )
      : 0;

  return (
    <div className="flex min-h-screen" style={{ background: "#F3EAD7" }}>
      <PortalSidebar
        portalRole="Student / Parent Portal"
        roleColor="#2B6AA6"
        items={SIDEBAR_ITEMS}
        activeItem={active}
        onItemClick={setActive}
      />

      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-5xl">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="student-name"
                className="text-xs font-semibold"
                style={{ color: "#5A4F43" }}
              >
                Student:
              </Label>
              <Input
                id="student-name"
                data-ocid="student.name.input"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-36 text-sm h-8"
                placeholder="Student name"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label
                htmlFor="student-class"
                className="text-xs font-semibold"
                style={{ color: "#5A4F43" }}
              >
                Class:
              </Label>
              <Input
                id="student-class"
                data-ocid="student.class.input"
                value={formClass}
                onChange={(e) => setFormClass(e.target.value)}
                className="w-24 text-sm h-8"
                placeholder="e.g. X-A"
              />
            </div>
          </div>

          {active === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1
                className="text-2xl font-bold mb-1"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#0E2E40",
                }}
              >
                Welcome, {studentName}
              </h1>
              <p className="text-sm mb-6" style={{ color: "#5A4F43" }}>
                Class {formClass} — Your academic dashboard
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  {
                    label: "Avg. Score",
                    value: `${avgMarks}%`,
                    color: "#2B6AA6",
                  },
                  {
                    label: "Homework Due",
                    value: String(displayHomework.length),
                    color: "#C9A45A",
                  },
                  {
                    label: "Fees Pending",
                    value: String(displayFees.filter((f) => !f.paid).length),
                    color: displayFees.some((f) => !f.paid)
                      ? "#e74c3c"
                      : "#1F7E7A",
                  },
                  {
                    label: "Subjects",
                    value: String(displayResults.length),
                    color: "#238C86",
                  },
                ].map((stat) => (
                  <Card
                    key={stat.label}
                    className="border-0 shadow-card bg-white"
                  >
                    <CardContent className="p-4">
                      <div
                        className="text-2xl font-bold mb-1"
                        style={{
                          color: stat.color,
                          fontFamily: "'Playfair Display', serif",
                        }}
                      >
                        {stat.value}
                      </div>
                      <div className="text-xs" style={{ color: "#5A4F43" }}>
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <Card className="border-0 shadow-card bg-white">
                  <CardHeader>
                    <CardTitle
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        color: "#0E2E40",
                        fontSize: "1rem",
                      }}
                    >
                      Subject Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {displayResults.map((r) => (
                      <div key={r.subject}>
                        <div
                          className="flex justify-between text-xs mb-1"
                          style={{ color: "#5A4F43" }}
                        >
                          <span>{r.subject}</span>
                          <span>{String(r.marks)}/100</span>
                        </div>
                        <Progress value={Number(r.marks)} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-card bg-white">
                  <CardHeader>
                    <CardTitle
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        color: "#0E2E40",
                        fontSize: "1rem",
                      }}
                    >
                      Upcoming Homework
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {displayHomework.slice(0, 3).map((hw) => (
                      <div
                        key={hw.subject}
                        className="p-3 rounded-lg"
                        style={{ background: "#F3EAD7" }}
                      >
                        <div className="flex items-center justify-between">
                          <p
                            className="text-sm font-semibold"
                            style={{ color: "#0E2E40" }}
                          >
                            {hw.subject}
                          </p>
                          <span
                            className="text-xs"
                            style={{ color: "#8A7560" }}
                          >
                            Due{" "}
                            {new Date(
                              Number(hw.dueDate) / 1_000_000,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <p
                          className="text-xs mt-1 line-clamp-2"
                          style={{ color: "#5A4F43" }}
                        >
                          {hw.description}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {active === "timetable" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1
                className="text-2xl font-bold mb-6"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#0E2E40",
                }}
              >
                Class Timetable
              </h1>
              {ttLoading ? (
                <div data-ocid="timetable.loading_state">
                  <Skeleton className="h-12 w-full mb-2" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <Card className="border-0 shadow-card bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Day</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Teacher</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayTimetable.map((t, i) => (
                        <TableRow
                          key={`${t.day}-${t.subject}`}
                          data-ocid={`timetable.item.${i + 1}`}
                        >
                          <TableCell className="font-medium">{t.day}</TableCell>
                          <TableCell>{t.subject}</TableCell>
                          <TableCell>{t.teacher}</TableCell>
                          <TableCell>{t.timeSlot}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </motion.div>
          )}

          {active === "homework" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1
                className="text-2xl font-bold mb-6"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#0E2E40",
                }}
              >
                Homework Assignments
              </h1>
              {hwLoading ? (
                <div data-ocid="homework.loading_state">
                  <Skeleton className="h-20 w-full mb-2" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <div className="space-y-3">
                  {displayHomework.map((hw, i) => (
                    <Card
                      key={hw.subject}
                      data-ocid={`homework.item.${i + 1}`}
                      className="border-0 shadow-card bg-white"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p
                              className="font-semibold text-sm mb-1"
                              style={{
                                color: "#0E2E40",
                                fontFamily: "'Playfair Display', serif",
                              }}
                            >
                              {hw.subject}
                            </p>
                            <p
                              className="text-xs leading-relaxed"
                              style={{ color: "#5A4F43" }}
                            >
                              {hw.description}
                            </p>
                          </div>
                          <div className="text-right ml-4 flex-shrink-0">
                            <p
                              className="text-xs font-semibold"
                              style={{ color: "#C9A45A" }}
                            >
                              Due
                            </p>
                            <p className="text-xs" style={{ color: "#5A4F43" }}>
                              {new Date(
                                Number(hw.dueDate) / 1_000_000,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {active === "results" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1
                className="text-2xl font-bold mb-6"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#0E2E40",
                }}
              >
                Exam Results
              </h1>
              {resLoading ? (
                <div data-ocid="results.loading_state">
                  <Skeleton className="h-12 w-full mb-2" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <Card className="border-0 shadow-card bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Marks</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Performance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayResults.map((r, i) => (
                        <TableRow
                          key={r.subject}
                          data-ocid={`results.item.${i + 1}`}
                        >
                          <TableCell className="font-medium">
                            {r.subject}
                          </TableCell>
                          <TableCell>{String(r.marks)}/100</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                GRADE_COLORS[r.grade] ??
                                "bg-gray-100 text-gray-700"
                              }
                            >
                              {r.grade}
                            </Badge>
                          </TableCell>
                          <TableCell className="w-32">
                            <Progress value={Number(r.marks)} className="h-2" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </motion.div>
          )}

          {active === "fees" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1
                className="text-2xl font-bold mb-6"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#0E2E40",
                }}
              >
                Fee Records
              </h1>
              {feeLoading ? (
                <div data-ocid="fees.loading_state">
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="space-y-3">
                  {displayFees.map((f, i) => (
                    <Card
                      key={f.receiptNumber}
                      data-ocid={`fees.item.${i + 1}`}
                      className="border-0 shadow-card bg-white"
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p
                            className="font-semibold text-sm"
                            style={{ color: "#0E2E40" }}
                          >
                            ₹{String(f.amount)}
                          </p>
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: "#5A4F43" }}
                          >
                            Due:{" "}
                            {new Date(
                              Number(f.dueDate) / 1_000_000,
                            ).toLocaleDateString()}{" "}
                            | Receipt: {f.receiptNumber}
                          </p>
                        </div>
                        <Badge
                          className={
                            f.paid
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }
                        >
                          {f.paid ? "Paid" : "Pending"}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {active === "announcements" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1
                className="text-2xl font-bold mb-6"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#0E2E40",
                }}
              >
                Announcements
              </h1>
              <div className="space-y-3">
                {(announcements && announcements.length > 0
                  ? announcements
                  : [
                      {
                        title: "Annual Sports Day",
                        content: "Sports Day on 15th April 2026.",
                        category: { event: null },
                        date: BigInt(Date.now()) * 1_000_000n,
                      },
                      {
                        title: "Fee Deadline",
                        content:
                          "Q4 fees due by 10th April. Pay online or at reception.",
                        category: { fee: null },
                        date: BigInt(Date.now()) * 1_000_000n,
                      },
                      {
                        title: "Board Exam Schedule",
                        content:
                          "Class X board exams commence from 20th February. Admit cards available.",
                        category: { academic: null },
                        date: BigInt(Date.now()) * 1_000_000n,
                      },
                    ]
                ).map((ann, i) => (
                  <Card
                    key={ann.title}
                    data-ocid={`announcements.item.${i + 1}`}
                    className="border-0 shadow-card bg-white"
                  >
                    <CardContent className="p-4 flex items-start justify-between">
                      <div>
                        <p
                          className="font-semibold text-sm"
                          style={{ color: "#0E2E40" }}
                        >
                          {ann.title}
                        </p>
                        <p
                          className="text-xs mt-1"
                          style={{ color: "#5A4F43" }}
                        >
                          {ann.content}
                        </p>
                      </div>
                      <Badge className="bg-[#2B6AA6] text-white text-xs ml-3">
                        {Object.keys(ann.category)[0]}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {active === "documents" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1
                className="text-2xl font-bold mb-6"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#0E2E40",
                }}
              >
                Documents
              </h1>
              {documents && documents.length > 0 ? (
                <Card className="border-0 shadow-card bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((d, i) => (
                        <TableRow
                          key={d.title}
                          data-ocid={`documents.item.${i + 1}`}
                        >
                          <TableCell className="font-medium">
                            {d.title}
                          </TableCell>
                          <TableCell>{Object.keys(d.category)[0]}</TableCell>
                          <TableCell>
                            <a
                              href={d.blob.getDirectURL()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold"
                              style={{ color: "#2B6AA6" }}
                            >
                              View
                            </a>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              ) : (
                <div
                  data-ocid="documents.empty_state"
                  className="text-center p-8 rounded-xl bg-white shadow-card"
                >
                  <FileText
                    className="h-12 w-12 mx-auto mb-4"
                    style={{ color: "#C9A45A" }}
                  />
                  <p className="text-sm" style={{ color: "#5A4F43" }}>
                    No documents available yet. Check back later.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
