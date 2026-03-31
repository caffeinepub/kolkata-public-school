import { PortalSidebar } from "@/components/PortalSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  useAddVisitor,
  useAllStaff,
  useAllStudents,
  useAnnouncements,
  useCheckOutVisitor,
  useStudentFeeRecords,
  useVisitorLogs,
} from "@/hooks/useQueries";
import {
  CreditCard,
  LayoutDashboard,
  Loader2,
  LogIn,
  Megaphone,
  Search,
  UserCheck,
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
  { id: "visitors", label: "Visitor Log", icon: <Users className="h-4 w-4" /> },
  { id: "fees", label: "Fee Status", icon: <CreditCard className="h-4 w-4" /> },
  {
    id: "announcements",
    label: "Announcements",
    icon: <Megaphone className="h-4 w-4" />,
  },
  { id: "directory", label: "Directory", icon: <Search className="h-4 w-4" /> },
];

const SAMPLE_VISITORS = [
  {
    name: "Suresh Kumar",
    purpose: "Parent meeting",
    contact: "9876500100",
    host: "Mrs. Sharma",
    checkInTime: BigInt(Date.now()) * 1_000_000n,
    checkOutTime: undefined as bigint | undefined,
  },
  {
    name: "Ravi Sinha",
    purpose: "Admissions inquiry",
    contact: "9876500101",
    host: "Admin Office",
    checkInTime: BigInt(Date.now() - 3600000) * 1_000_000n,
    checkOutTime: BigInt(Date.now()) * 1_000_000n,
  },
];

export default function ReceptionDashboard() {
  const [active, setActive] = useState("overview");
  const [visitorForm, setVisitorForm] = useState({
    name: "",
    purpose: "",
    contact: "",
    host: "",
  });
  const [feeSearch, setFeeSearch] = useState("");
  const [dirSearch, setDirSearch] = useState("");

  const { data: visitors, isLoading: visLoading } = useVisitorLogs();
  const { data: feeRecords, isLoading: feeLoading } =
    useStudentFeeRecords(feeSearch);
  const { data: announcements } = useAnnouncements();
  const { data: students } = useAllStudents();
  const { data: staff } = useAllStaff();
  const addVisitor = useAddVisitor();
  const checkOut = useCheckOutVisitor();

  const displayVisitors =
    visitors && visitors.length > 0 ? visitors : SAMPLE_VISITORS;

  const handleAddVisitor = async () => {
    if (!visitorForm.name || !visitorForm.purpose) {
      toast.error("Fill required fields");
      return;
    }
    try {
      await addVisitor.mutateAsync(visitorForm);
      toast.success("Visitor logged!");
      setVisitorForm({ name: "", purpose: "", contact: "", host: "" });
    } catch {
      toast.error("Failed to log visitor");
    }
  };

  const filteredDir = dirSearch
    ? [
        ...(students ?? [])
          .filter((s) => s.name.toLowerCase().includes(dirSearch.toLowerCase()))
          .map((s) => ({
            name: s.name,
            dept: s.formClass,
            contact: s.parentContact,
            type: "Student",
          })),
        ...(staff ?? [])
          .filter((s) => s.name.toLowerCase().includes(dirSearch.toLowerCase()))
          .map((s) => ({
            name: s.name,
            dept: s.subjectOrDepartment,
            contact: s.contact,
            type: "Staff",
          })),
      ]
    : [];

  return (
    <div className="flex min-h-screen" style={{ background: "#F3EAD7" }}>
      <PortalSidebar
        portalRole="Reception Portal"
        roleColor="#238C86"
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
                Reception Dashboard
              </h1>
              <p className="text-sm mb-6" style={{ color: "#5A4F43" }}>
                Manage visitors, check fee status and look up records.
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[
                  {
                    label: "Visitors Today",
                    value: String(
                      displayVisitors.filter((v) => !v.checkOutTime).length,
                    ),
                    color: "#238C86",
                  },
                  {
                    label: "Total Students",
                    value: String(students?.length ?? 248),
                    color: "#2D6FA3",
                  },
                  {
                    label: "Announcements",
                    value: String(announcements?.length ?? 4),
                    color: "#C9A45A",
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
                      fontSize: "1rem",
                    }}
                  >
                    Active Visitors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {displayVisitors.filter((v) => !v.checkOutTime).length ===
                  0 ? (
                    <p className="text-sm" style={{ color: "#5A4F43" }}>
                      No visitors currently on premises.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {displayVisitors
                        .filter((v) => !v.checkOutTime)
                        .map((v) => (
                          <div
                            key={v.name}
                            className="flex items-center justify-between p-3 rounded-lg"
                            style={{ background: "#F3EAD7" }}
                          >
                            <div>
                              <p
                                className="text-sm font-semibold"
                                style={{ color: "#0E2E40" }}
                              >
                                {v.name}
                              </p>
                              <p
                                className="text-xs"
                                style={{ color: "#5A4F43" }}
                              >
                                {v.purpose} — Host: {v.host}
                              </p>
                            </div>
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              Active
                            </Badge>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {active === "visitors" && (
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
                Visitor Log
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
                    Register Visitor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      data-ocid="visitor.name.input"
                      placeholder="Visitor Name *"
                      value={visitorForm.name}
                      onChange={(e) =>
                        setVisitorForm((p) => ({ ...p, name: e.target.value }))
                      }
                    />
                    <Input
                      data-ocid="visitor.purpose.input"
                      placeholder="Purpose *"
                      value={visitorForm.purpose}
                      onChange={(e) =>
                        setVisitorForm((p) => ({
                          ...p,
                          purpose: e.target.value,
                        }))
                      }
                    />
                    <Input
                      data-ocid="visitor.contact.input"
                      placeholder="Contact Number"
                      value={visitorForm.contact}
                      onChange={(e) =>
                        setVisitorForm((p) => ({
                          ...p,
                          contact: e.target.value,
                        }))
                      }
                    />
                    <Input
                      data-ocid="visitor.host.input"
                      placeholder="Host / Department"
                      value={visitorForm.host}
                      onChange={(e) =>
                        setVisitorForm((p) => ({ ...p, host: e.target.value }))
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    data-ocid="visitor.submit.button"
                    onClick={handleAddVisitor}
                    disabled={addVisitor.isPending}
                    className="w-full text-white"
                    style={{ background: "#238C86" }}
                  >
                    {addVisitor.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LogIn className="mr-2 h-4 w-4" />
                    )}{" "}
                    Check In Visitor
                  </Button>
                </CardContent>
              </Card>
              {visLoading ? (
                <div data-ocid="visitors.loading_state">
                  <Skeleton className="h-12 w-full mb-2" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <Card className="border-0 shadow-card bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Purpose</TableHead>
                        <TableHead>Host</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayVisitors.map((v, i) => (
                        <TableRow
                          key={v.name}
                          data-ocid={`visitors.item.${i + 1}`}
                        >
                          <TableCell className="font-medium">
                            {v.name}
                          </TableCell>
                          <TableCell>{v.purpose}</TableCell>
                          <TableCell>{v.host}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                v.checkOutTime
                                  ? "bg-gray-100 text-gray-600"
                                  : "bg-green-100 text-green-700"
                              }
                            >
                              {v.checkOutTime ? "Checked Out" : "Active"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {!v.checkOutTime && (
                              <Button
                                type="button"
                                data-ocid={`visitors.checkout.button.${i + 1}`}
                                size="sm"
                                onClick={() => checkOut.mutate(v.name)}
                                disabled={checkOut.isPending}
                                className="text-white text-xs"
                                style={{ background: "#238C86" }}
                              >
                                <UserCheck className="mr-1 h-3 w-3" />
                                Check Out
                              </Button>
                            )}
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
                Fee Status Lookup
              </h1>
              <div className="flex gap-3 mb-5 max-w-lg">
                <Input
                  data-ocid="fees.search.input"
                  placeholder="Enter student name..."
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
                    No records found for "{feeSearch}".
                  </div>
                )
              ) : null}
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
                        title: "Staff Meeting",
                        content: "All staff must attend the Saturday meeting.",
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
                      <Badge className="bg-[#238C86] text-white text-xs ml-3">
                        {Object.keys(ann.category)[0]}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {active === "directory" && (
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
                Quick Lookup
              </h1>
              <div className="flex gap-3 mb-5 max-w-lg">
                <Input
                  data-ocid="directory.search.input"
                  placeholder="Search student or staff name..."
                  value={dirSearch}
                  onChange={(e) => setDirSearch(e.target.value)}
                />
              </div>
              {filteredDir.length > 0 ? (
                <Card className="border-0 shadow-card bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Class / Dept</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDir.map((d, i) => (
                        <TableRow
                          key={d.name}
                          data-ocid={`directory.item.${i + 1}`}
                        >
                          <TableCell className="font-medium">
                            {d.name}
                          </TableCell>
                          <TableCell>{d.dept}</TableCell>
                          <TableCell>{d.contact}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                d.type === "Student"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-purple-100 text-purple-700"
                              }
                            >
                              {d.type}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              ) : (
                <div
                  data-ocid="directory.empty_state"
                  className="text-sm"
                  style={{ color: "#5A4F43" }}
                >
                  {dirSearch
                    ? `No results found for "${dirSearch}".`
                    : "Type a name to search the directory."}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
