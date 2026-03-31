import { PortalSidebar } from "@/components/PortalSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useAllStudents,
  useAnnouncements,
  useCreateHomework,
  useTeacherTimetable,
} from "@/hooks/useQueries";
import {
  BookMarked,
  Clock,
  FileText,
  LayoutDashboard,
  Loader2,
  Megaphone,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const SIDEBAR_ITEMS = [
  {
    id: "overview",
    label: "Overview",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    id: "timetable",
    label: "My Timetable",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    id: "homework",
    label: "Post Homework",
    icon: <BookMarked className="h-4 w-4" />,
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
  {
    id: "students",
    label: "Student Directory",
    icon: <Users className="h-4 w-4" />,
  },
];

const SAMPLE_TIMETABLE = [
  {
    day: "Monday",
    subject: "Mathematics",
    formClass: "Class X-A",
    timeSlot: "9:00 - 10:00",
    teacher: "Mrs. Sharma",
  },
  {
    day: "Monday",
    subject: "Mathematics",
    formClass: "Class IX-B",
    timeSlot: "11:00 - 12:00",
    teacher: "Mrs. Sharma",
  },
  {
    day: "Tuesday",
    subject: "Mathematics",
    formClass: "Class X-A",
    timeSlot: "8:00 - 9:00",
    teacher: "Mrs. Sharma",
  },
  {
    day: "Wednesday",
    subject: "Mathematics",
    formClass: "Class VIII-A",
    timeSlot: "10:00 - 11:00",
    teacher: "Mrs. Sharma",
  },
  {
    day: "Thursday",
    subject: "Mathematics",
    formClass: "Class IX-B",
    timeSlot: "9:00 - 10:00",
    teacher: "Mrs. Sharma",
  },
];

const SAMPLE_STUDENTS = [
  {
    name: "Aryan Ghosh",
    formClass: "Class X-A",
    rollNumber: 1n,
    parentContact: "9876543210",
  },
  {
    name: "Priya Chatterjee",
    formClass: "Class X-A",
    rollNumber: 2n,
    parentContact: "9876543211",
  },
  {
    name: "Rohan Mukherjee",
    formClass: "Class IX-B",
    rollNumber: 1n,
    parentContact: "9876543212",
  },
  {
    name: "Sonal Bose",
    formClass: "Class IX-B",
    rollNumber: 2n,
    parentContact: "9876543213",
  },
  {
    name: "Ankit Das",
    formClass: "Class VIII-A",
    rollNumber: 1n,
    parentContact: "9876543214",
  },
];

export default function TeacherDashboard() {
  const [active, setActive] = useState("overview");
  const [teacherName, setTeacherName] = useState("Mrs. Sharma");
  const [hwForm, setHwForm] = useState({
    subject: "",
    formClass: "",
    description: "",
    dueDate: "",
  });

  const { data: announcements, isLoading: annLoading } = useAnnouncements();
  const { data: timetable, isLoading: ttLoading } =
    useTeacherTimetable(teacherName);
  const { data: students, isLoading: studentsLoading } = useAllStudents();
  const createHw = useCreateHomework();

  const displayTimetable =
    timetable && timetable.length > 0 ? timetable : SAMPLE_TIMETABLE;
  const displayStudents =
    students && students.length > 0 ? students : SAMPLE_STUDENTS;

  const handlePostHomework = async () => {
    if (
      !hwForm.subject ||
      !hwForm.formClass ||
      !hwForm.description ||
      !hwForm.dueDate
    ) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      await createHw.mutateAsync({
        subject: hwForm.subject,
        formClass: hwForm.formClass,
        description: hwForm.description,
        dueDate: BigInt(new Date(hwForm.dueDate).getTime()) * 1_000_000n,
      });
      toast.success("Homework posted successfully!");
      setHwForm({ subject: "", formClass: "", description: "", dueDate: "" });
    } catch {
      toast.error("Failed to post homework");
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: "#F3EAD7" }}>
      <PortalSidebar
        portalRole="Teacher Portal"
        roleColor="#1F7E7A"
        items={SIDEBAR_ITEMS}
        activeItem={active}
        onItemClick={setActive}
      />

      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-5xl">
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
                Welcome back, {teacherName}
              </h1>
              <p className="text-sm mb-6" style={{ color: "#5A4F43" }}>
                Here's your teaching overview for today.
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Classes Today", value: "3", color: "#1F7E7A" },
                  {
                    label: "Students",
                    value: String(displayStudents.length),
                    color: "#2D6FA3",
                  },
                  { label: "Homework Due", value: "2", color: "#C9A45A" },
                  {
                    label: "Announcements",
                    value: String(announcements?.length ?? 4),
                    color: "#8B5E3C",
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
              <Card className="border-0 shadow-card bg-white">
                <CardHeader>
                  <CardTitle
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      color: "#0E2E40",
                    }}
                  >
                    Today's Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {displayTimetable
                      .filter((t) => t.day === "Monday")
                      .map((t) => (
                        <div
                          key={`${t.day}-${t.subject}-${t.formClass}`}
                          className="flex items-center justify-between p-3 rounded-lg"
                          style={{ background: "#F3EAD7" }}
                        >
                          <div>
                            <div
                              className="text-sm font-semibold"
                              style={{ color: "#0E2E40" }}
                            >
                              {t.subject} — {t.formClass}
                            </div>
                            <div
                              className="text-xs"
                              style={{ color: "#5A4F43" }}
                            >
                              {t.timeSlot}
                            </div>
                          </div>
                          <Badge className="bg-[#1F7E7A] text-white text-xs">
                            {t.day}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {active === "timetable" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <h1
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "#0E2E40",
                  }}
                >
                  My Timetable
                </h1>
                <Input
                  id="teacher-name-input"
                  data-ocid="timetable.teacher_name.input"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="Teacher name"
                  className="w-40 text-sm"
                />
              </div>
              {ttLoading ? (
                <div className="space-y-2" data-ocid="timetable.loading_state">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <Card className="border-0 shadow-card bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Day</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayTimetable.map((t, i) => (
                        <TableRow
                          key={`${t.day}-${t.subject}-${t.timeSlot}`}
                          data-ocid={`timetable.item.${i + 1}`}
                        >
                          <TableCell className="font-medium">{t.day}</TableCell>
                          <TableCell>{t.subject}</TableCell>
                          <TableCell>{t.formClass}</TableCell>
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
                Post Homework
              </h1>
              <Card className="border-0 shadow-card bg-white max-w-xl">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label
                      htmlFor="hw-subject"
                      className="text-xs font-semibold uppercase tracking-wide mb-1 block"
                      style={{ color: "#5A4F43" }}
                    >
                      Subject
                    </Label>
                    <Input
                      id="hw-subject"
                      data-ocid="homework.subject.input"
                      value={hwForm.subject}
                      onChange={(e) =>
                        setHwForm((p) => ({ ...p, subject: e.target.value }))
                      }
                      placeholder="e.g., Mathematics"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="hw-class"
                      className="text-xs font-semibold uppercase tracking-wide mb-1 block"
                      style={{ color: "#5A4F43" }}
                    >
                      Class
                    </Label>
                    <Input
                      id="hw-class"
                      data-ocid="homework.class.input"
                      value={hwForm.formClass}
                      onChange={(e) =>
                        setHwForm((p) => ({ ...p, formClass: e.target.value }))
                      }
                      placeholder="e.g., Class X-A"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="hw-desc"
                      className="text-xs font-semibold uppercase tracking-wide mb-1 block"
                      style={{ color: "#5A4F43" }}
                    >
                      Description
                    </Label>
                    <Textarea
                      id="hw-desc"
                      data-ocid="homework.description.textarea"
                      value={hwForm.description}
                      onChange={(e) =>
                        setHwForm((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Describe the homework assignment..."
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="hw-due"
                      className="text-xs font-semibold uppercase tracking-wide mb-1 block"
                      style={{ color: "#5A4F43" }}
                    >
                      Due Date
                    </Label>
                    <Input
                      id="hw-due"
                      data-ocid="homework.duedate.input"
                      type="date"
                      value={hwForm.dueDate}
                      onChange={(e) =>
                        setHwForm((p) => ({ ...p, dueDate: e.target.value }))
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    data-ocid="homework.submit.button"
                    onClick={handlePostHomework}
                    disabled={createHw.isPending}
                    className="w-full text-white font-semibold"
                    style={{ background: "#1F7E7A" }}
                  >
                    {createHw.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Post Homework"
                    )}
                  </Button>
                </CardContent>
              </Card>
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
              {annLoading ? (
                <div
                  className="space-y-3"
                  data-ocid="announcements.loading_state"
                >
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {(announcements && announcements.length > 0
                    ? announcements
                    : [
                        {
                          title: "Annual Sports Day 2026",
                          content: "Sports Day on 15th April 2026",
                          category: { event: null },
                          date: BigInt(Date.now()) * 1_000_000n,
                        },
                        {
                          title: "Staff Meeting Notice",
                          content:
                            "Mandatory staff meeting on Saturday at 2 PM in the conference hall.",
                          category: { general: null },
                          date: BigInt(Date.now()) * 1_000_000n,
                        },
                      ]
                  ).map((ann, i) => (
                    <Card
                      key={ann.title}
                      data-ocid={`announcements.item.${i + 1}`}
                      className="border-0 shadow-card bg-white"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div
                              className="font-semibold text-sm mb-1"
                              style={{
                                color: "#0E2E40",
                                fontFamily: "'Playfair Display', serif",
                              }}
                            >
                              {ann.title}
                            </div>
                            <div
                              className="text-xs"
                              style={{ color: "#5A4F43" }}
                            >
                              {ann.content}
                            </div>
                          </div>
                          <Badge className="ml-3 text-xs bg-[#1F7E7A] text-white">
                            {Object.keys(ann.category)[0]}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
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
              <Card className="border-0 shadow-card bg-white">
                <CardContent
                  className="p-8 text-center"
                  data-ocid="documents.empty_state"
                >
                  <FileText
                    className="h-12 w-12 mx-auto mb-4"
                    style={{ color: "#C9A45A" }}
                  />
                  <p
                    className="text-sm font-semibold mb-1"
                    style={{ color: "#0E2E40" }}
                  >
                    Upload School Documents
                  </p>
                  <p className="text-xs mb-4" style={{ color: "#5A4F43" }}>
                    Share study materials, worksheets and notices with students.
                  </p>
                  <Button
                    type="button"
                    data-ocid="documents.upload.button"
                    className="text-white"
                    style={{ background: "#1F7E7A" }}
                  >
                    Upload Document
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {active === "students" && (
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
                Student Directory
              </h1>
              {studentsLoading ? (
                <div className="space-y-2" data-ocid="students.loading_state">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <Card className="border-0 shadow-card bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Roll No.</TableHead>
                        <TableHead>Parent Contact</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayStudents.map((s, i) => (
                        <TableRow
                          key={s.name}
                          data-ocid={`students.item.${i + 1}`}
                        >
                          <TableCell className="font-medium">
                            {s.name}
                          </TableCell>
                          <TableCell>{s.formClass}</TableCell>
                          <TableCell>{String(s.rollNumber)}</TableCell>
                          <TableCell>{s.parentContact}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
