import type { Category } from "@/backend";
import { PortalSidebar } from "@/components/PortalSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  useAddExamResult,
  useAddStaff,
  useAddStudent,
  useAllDocuments,
  useAllStaff,
  useAllStudents,
  useAnnouncements,
  useCreateAnnouncement,
  useMarkFeePaid,
  useStudentFeeRecords,
} from "@/hooks/useQueries";
import {
  BookCheck,
  CheckCircle,
  CreditCard,
  FileText,
  LayoutDashboard,
  Loader2,
  Megaphone,
  PlusCircle,
  UserCog,
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
    id: "announcements",
    label: "Announcements",
    icon: <Megaphone className="h-4 w-4" />,
  },
  { id: "students", label: "Students", icon: <Users className="h-4 w-4" /> },
  { id: "staff", label: "Staff", icon: <UserCog className="h-4 w-4" /> },
  {
    id: "fees",
    label: "Fee Records",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    id: "results",
    label: "Exam Results",
    icon: <BookCheck className="h-4 w-4" />,
  },
  {
    id: "documents",
    label: "Documents",
    icon: <FileText className="h-4 w-4" />,
  },
];

const SAMPLE_STUDENTS = [
  {
    name: "Aryan Ghosh",
    formClass: "X-A",
    rollNumber: 1n,
    parentContact: "9876543210",
  },
  {
    name: "Priya Chatterjee",
    formClass: "X-A",
    rollNumber: 2n,
    parentContact: "9876543211",
  },
  {
    name: "Rohan Mukherjee",
    formClass: "IX-B",
    rollNumber: 1n,
    parentContact: "9876543212",
  },
  {
    name: "Sonal Bose",
    formClass: "IX-B",
    rollNumber: 2n,
    parentContact: "9876543213",
  },
];

const SAMPLE_STAFF = [
  {
    name: "Mrs. Sharma",
    subjectOrDepartment: "Mathematics",
    contact: "9876500001",
  },
  {
    name: "Mr. Banerjee",
    subjectOrDepartment: "Science",
    contact: "9876500002",
  },
  { name: "Ms. Roy", subjectOrDepartment: "English", contact: "9876500003" },
  {
    name: "Mr. Sengupta",
    subjectOrDepartment: "History",
    contact: "9876500004",
  },
];

export default function AdminDashboard() {
  const [active, setActive] = useState("overview");
  const [annForm, setAnnForm] = useState({
    title: "",
    content: "",
    category: "general",
  });
  const [studentForm, setStudentForm] = useState({
    name: "",
    formClass: "",
    rollNumber: "",
    parentContact: "",
  });
  const [staffForm, setStaffForm] = useState({
    name: "",
    subjectOrDepartment: "",
    contact: "",
  });
  const [feeSearch, setFeeSearch] = useState("");
  const [resultForm, setResultForm] = useState({
    student: "",
    subject: "",
    marks: "",
    grade: "",
  });

  const { data: announcements, isLoading: annLoading } = useAnnouncements();
  const { data: students, isLoading: stuLoading } = useAllStudents();
  const { data: staff, isLoading: staffLoading } = useAllStaff();
  const { data: feeRecords, isLoading: feeLoading } =
    useStudentFeeRecords(feeSearch);
  const { data: documents } = useAllDocuments();

  const createAnn = useCreateAnnouncement();
  const addStudent = useAddStudent();
  const addStaff = useAddStaff();
  const markPaid = useMarkFeePaid();
  const addResult = useAddExamResult();

  const displayStudents =
    students && students.length > 0 ? students : SAMPLE_STUDENTS;
  const displayStaff = staff && staff.length > 0 ? staff : SAMPLE_STAFF;

  const handleCreateAnn = async () => {
    if (!annForm.title || !annForm.content) {
      toast.error("Fill all fields");
      return;
    }
    try {
      await createAnn.mutateAsync({
        title: annForm.title,
        content: annForm.content,
        category: annForm.category as Category,
      });
      toast.success("Announcement created!");
      setAnnForm({ title: "", content: "", category: "general" });
    } catch {
      toast.error("Failed to create announcement");
    }
  };

  const handleAddStudent = async () => {
    if (
      !studentForm.name ||
      !studentForm.formClass ||
      !studentForm.rollNumber
    ) {
      toast.error("Fill all fields");
      return;
    }
    try {
      await addStudent.mutateAsync({
        name: studentForm.name,
        formClass: studentForm.formClass,
        rollNumber: BigInt(studentForm.rollNumber),
        parentContact: studentForm.parentContact,
      });
      toast.success("Student added!");
      setStudentForm({
        name: "",
        formClass: "",
        rollNumber: "",
        parentContact: "",
      });
    } catch {
      toast.error("Failed to add student");
    }
  };

  const handleAddStaff = async () => {
    if (!staffForm.name || !staffForm.subjectOrDepartment) {
      toast.error("Fill all fields");
      return;
    }
    try {
      await addStaff.mutateAsync(staffForm);
      toast.success("Staff member added!");
      setStaffForm({ name: "", subjectOrDepartment: "", contact: "" });
    } catch {
      toast.error("Failed to add staff");
    }
  };

  const handleAddResult = async () => {
    if (
      !resultForm.student ||
      !resultForm.subject ||
      !resultForm.marks ||
      !resultForm.grade
    ) {
      toast.error("Fill all fields");
      return;
    }
    try {
      await addResult.mutateAsync({
        student: resultForm.student,
        subject: resultForm.subject,
        marks: BigInt(resultForm.marks),
        grade: resultForm.grade,
      });
      toast.success("Result added!");
      setResultForm({ student: "", subject: "", marks: "", grade: "" });
    } catch {
      toast.error("Failed to add result");
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: "#F3EAD7" }}>
      <PortalSidebar
        portalRole="Admin Portal"
        roleColor="#2D6FA3"
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
                Administration Dashboard
              </h1>
              <p className="text-sm mb-6" style={{ color: "#5A4F43" }}>
                School-wide management and analytics.
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  {
                    label: "Total Students",
                    value: String(displayStudents.length),
                    color: "#2D6FA3",
                  },
                  {
                    label: "Total Staff",
                    value: String(displayStaff.length),
                    color: "#1F7E7A",
                  },
                  {
                    label: "Announcements",
                    value: String(announcements?.length ?? 4),
                    color: "#C9A45A",
                  },
                  {
                    label: "Documents",
                    value: String(documents?.length ?? 12),
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
                      Fee Collection Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { cls: "Class X", pct: 84 },
                      { cls: "Class IX", pct: 71 },
                      { cls: "Class VIII", pct: 90 },
                      { cls: "Class VII", pct: 65 },
                    ].map((c) => (
                      <div key={c.cls}>
                        <div
                          className="flex justify-between text-xs mb-1"
                          style={{ color: "#5A4F43" }}
                        >
                          <span>{c.cls}</span>
                          <span>{c.pct}%</span>
                        </div>
                        <Progress value={c.pct} className="h-2" />
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
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      {
                        text: "New student Aryan Ghosh enrolled in Class X-A",
                        time: "2h ago",
                      },
                      {
                        text: "Fee record created for Priya Chatterjee",
                        time: "4h ago",
                      },
                      {
                        text: "Staff meeting announcement posted",
                        time: "1d ago",
                      },
                    ].map((a) => (
                      <div
                        key={a.text}
                        className="flex items-start gap-3 p-2.5 rounded-lg"
                        style={{ background: "#F3EAD7" }}
                      >
                        <CheckCircle
                          className="h-4 w-4 mt-0.5 flex-shrink-0"
                          style={{ color: "#1F7E7A" }}
                        />
                        <div>
                          <p className="text-xs" style={{ color: "#0E2E40" }}>
                            {a.text}
                          </p>
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: "#8A7560" }}
                          >
                            {a.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
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
                Manage Announcements
              </h1>
              <Card className="border-0 shadow-card bg-white mb-6 max-w-xl">
                <CardHeader>
                  <CardTitle
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      color: "#0E2E40",
                      fontSize: "1rem",
                    }}
                  >
                    New Announcement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    data-ocid="announcement.title.input"
                    placeholder="Announcement Title"
                    value={annForm.title}
                    onChange={(e) =>
                      setAnnForm((p) => ({ ...p, title: e.target.value }))
                    }
                  />
                  <Textarea
                    data-ocid="announcement.content.textarea"
                    placeholder="Content..."
                    value={annForm.content}
                    onChange={(e) =>
                      setAnnForm((p) => ({ ...p, content: e.target.value }))
                    }
                    rows={3}
                  />
                  <Select
                    value={annForm.category}
                    onValueChange={(v) =>
                      setAnnForm((p) => ({ ...p, category: v }))
                    }
                  >
                    <SelectTrigger data-ocid="announcement.category.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="fee">Fee</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    data-ocid="announcement.submit.button"
                    onClick={handleCreateAnn}
                    disabled={createAnn.isPending}
                    className="w-full text-white"
                    style={{ background: "#2D6FA3" }}
                  >
                    {createAnn.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <PlusCircle className="mr-2 h-4 w-4" />
                    )}
                    Post Announcement
                  </Button>
                </CardContent>
              </Card>
              {annLoading ? (
                <div data-ocid="announcements.loading_state">
                  <Skeleton className="h-16 w-full mb-2" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : (
                <div className="space-y-3">
                  {(announcements && announcements.length > 0
                    ? announcements
                    : [
                        {
                          title: "Annual Sports Day",
                          content: "Sports Day on 15th April",
                          category: { event: null },
                          date: BigInt(Date.now()) * 1_000_000n,
                        },
                        {
                          title: "Fee Deadline",
                          content: "Q4 fees due by 10th April",
                          category: { fee: null },
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
                        <Badge className="bg-[#2D6FA3] text-white text-xs ml-3">
                          {Object.keys(ann.category)[0]}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
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
              <Card className="border-0 shadow-card bg-white mb-5 max-w-xl">
                <CardHeader>
                  <CardTitle
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      color: "#0E2E40",
                      fontSize: "1rem",
                    }}
                  >
                    Add New Student
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      data-ocid="student.name.input"
                      placeholder="Full Name"
                      value={studentForm.name}
                      onChange={(e) =>
                        setStudentForm((p) => ({ ...p, name: e.target.value }))
                      }
                    />
                    <Input
                      data-ocid="student.class.input"
                      placeholder="Class (e.g. X-A)"
                      value={studentForm.formClass}
                      onChange={(e) =>
                        setStudentForm((p) => ({
                          ...p,
                          formClass: e.target.value,
                        }))
                      }
                    />
                    <Input
                      data-ocid="student.roll.input"
                      placeholder="Roll Number"
                      type="number"
                      value={studentForm.rollNumber}
                      onChange={(e) =>
                        setStudentForm((p) => ({
                          ...p,
                          rollNumber: e.target.value,
                        }))
                      }
                    />
                    <Input
                      data-ocid="student.contact.input"
                      placeholder="Parent Contact"
                      value={studentForm.parentContact}
                      onChange={(e) =>
                        setStudentForm((p) => ({
                          ...p,
                          parentContact: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    data-ocid="student.submit.button"
                    onClick={handleAddStudent}
                    disabled={addStudent.isPending}
                    className="w-full text-white"
                    style={{ background: "#2D6FA3" }}
                  >
                    {addStudent.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <PlusCircle className="mr-2 h-4 w-4" />
                    )}{" "}
                    Add Student
                  </Button>
                </CardContent>
              </Card>
              {stuLoading ? (
                <div data-ocid="students.loading_state">
                  <Skeleton className="h-12 w-full mb-2" />
                  <Skeleton className="h-12 w-full" />
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

          {active === "staff" && (
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
                Staff Directory
              </h1>
              <Card className="border-0 shadow-card bg-white mb-5 max-w-xl">
                <CardHeader>
                  <CardTitle
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      color: "#0E2E40",
                      fontSize: "1rem",
                    }}
                  >
                    Add Staff Member
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    data-ocid="staff.name.input"
                    placeholder="Full Name"
                    value={staffForm.name}
                    onChange={(e) =>
                      setStaffForm((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                  <Input
                    data-ocid="staff.dept.input"
                    placeholder="Subject / Department"
                    value={staffForm.subjectOrDepartment}
                    onChange={(e) =>
                      setStaffForm((p) => ({
                        ...p,
                        subjectOrDepartment: e.target.value,
                      }))
                    }
                  />
                  <Input
                    data-ocid="staff.contact.input"
                    placeholder="Contact Number"
                    value={staffForm.contact}
                    onChange={(e) =>
                      setStaffForm((p) => ({ ...p, contact: e.target.value }))
                    }
                  />
                  <Button
                    type="button"
                    data-ocid="staff.submit.button"
                    onClick={handleAddStaff}
                    disabled={addStaff.isPending}
                    className="w-full text-white"
                    style={{ background: "#2D6FA3" }}
                  >
                    {addStaff.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <PlusCircle className="mr-2 h-4 w-4" />
                    )}{" "}
                    Add Staff
                  </Button>
                </CardContent>
              </Card>
              {staffLoading ? (
                <div data-ocid="staff.loading_state">
                  <Skeleton className="h-12 w-full mb-2" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <Card className="border-0 shadow-card bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Contact</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayStaff.map((s, i) => (
                        <TableRow
                          key={s.name + s.subjectOrDepartment}
                          data-ocid={`staff.item.${i + 1}`}
                        >
                          <TableCell className="font-medium">
                            {s.name}
                          </TableCell>
                          <TableCell>{s.subjectOrDepartment}</TableCell>
                          <TableCell>{s.contact}</TableCell>
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
              <div className="flex gap-3 mb-5 max-w-xl">
                <Input
                  data-ocid="fees.search.input"
                  placeholder="Search by student name..."
                  value={feeSearch}
                  onChange={(e) => setFeeSearch(e.target.value)}
                />
              </div>
              {feeSearch ? (
                feeLoading ? (
                  <div data-ocid="fees.loading_state">
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : feeRecords && feeRecords.length > 0 ? (
                  <Card className="border-0 shadow-card bg-white">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {feeRecords.map((f, i) => (
                          <TableRow
                            key={f.receiptNumber}
                            data-ocid={`fees.item.${i + 1}`}
                          >
                            <TableCell>{f.studentName}</TableCell>
                            <TableCell>₹{String(f.amount)}</TableCell>
                            <TableCell>
                              {new Date(
                                Number(f.dueDate) / 1_000_000,
                              ).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  f.paid
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }
                              >
                                {f.paid ? "Paid" : "Pending"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {!f.paid && (
                                <Button
                                  type="button"
                                  data-ocid={`fees.markpaid.button.${i + 1}`}
                                  size="sm"
                                  onClick={() =>
                                    markPaid.mutate(f.receiptNumber)
                                  }
                                  disabled={markPaid.isPending}
                                  className="text-white text-xs"
                                  style={{ background: "#1F7E7A" }}
                                >
                                  Mark Paid
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                ) : (
                  <div
                    data-ocid="fees.empty_state"
                    className="text-sm"
                    style={{ color: "#5A4F43" }}
                  >
                    No fee records found for "{feeSearch}".
                  </div>
                )
              ) : (
                <div
                  className="p-8 text-center rounded-xl bg-white shadow-card"
                  data-ocid="fees.empty_state"
                >
                  <CreditCard
                    className="h-10 w-10 mx-auto mb-3"
                    style={{ color: "#C9A45A" }}
                  />
                  <p className="text-sm" style={{ color: "#5A4F43" }}>
                    Enter a student name above to view fee records.
                  </p>
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
              <Card className="border-0 shadow-card bg-white mb-5 max-w-xl">
                <CardHeader>
                  <CardTitle
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      color: "#0E2E40",
                      fontSize: "1rem",
                    }}
                  >
                    Add Exam Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      data-ocid="result.student.input"
                      placeholder="Student Name"
                      value={resultForm.student}
                      onChange={(e) =>
                        setResultForm((p) => ({
                          ...p,
                          student: e.target.value,
                        }))
                      }
                    />
                    <Input
                      data-ocid="result.subject.input"
                      placeholder="Subject"
                      value={resultForm.subject}
                      onChange={(e) =>
                        setResultForm((p) => ({
                          ...p,
                          subject: e.target.value,
                        }))
                      }
                    />
                    <Input
                      data-ocid="result.marks.input"
                      placeholder="Marks (out of 100)"
                      type="number"
                      value={resultForm.marks}
                      onChange={(e) =>
                        setResultForm((p) => ({ ...p, marks: e.target.value }))
                      }
                    />
                    <Input
                      data-ocid="result.grade.input"
                      placeholder="Grade (A+/B/C...)"
                      value={resultForm.grade}
                      onChange={(e) =>
                        setResultForm((p) => ({ ...p, grade: e.target.value }))
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    data-ocid="result.submit.button"
                    onClick={handleAddResult}
                    disabled={addResult.isPending}
                    className="w-full text-white"
                    style={{ background: "#2D6FA3" }}
                  >
                    {addResult.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <PlusCircle className="mr-2 h-4 w-4" />
                    )}{" "}
                    Add Result
                  </Button>
                </CardContent>
              </Card>
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
              <div
                className="p-8 text-center rounded-xl bg-white shadow-card"
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
                  Document Repository
                </p>
                <p className="text-xs mb-4" style={{ color: "#5A4F43" }}>
                  {documents?.length ?? 0} documents stored. Upload circulars,
                  forms, and notices.
                </p>
                <Button
                  type="button"
                  data-ocid="documents.upload.button"
                  className="text-white"
                  style={{ background: "#2D6FA3" }}
                >
                  Upload Document
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
