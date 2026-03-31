import type { Category, SchoolRole } from "@/backend";
import type { ExternalBlob } from "@/backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useAnnouncements() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAnnouncements();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateAnnouncement() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { title: string; content: string; category: Category }) =>
      actor!.createAnnouncement(p.title, p.content, p.category),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}

export function useAllStudents() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStudents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddStudent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: {
      name: string;
      formClass: string;
      rollNumber: bigint;
      parentContact: string;
    }) => actor!.addStudent(p.name, p.formClass, p.rollNumber, p.parentContact),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

export function useAllStaff() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStaff();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddStaff() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: {
      name: string;
      subjectOrDepartment: string;
      contact: string;
    }) => actor!.addStaff(p.name, p.subjectOrDepartment, p.contact),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export function useStudentFeeRecords(studentName: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["feeRecords", studentName],
    queryFn: async () => {
      if (!actor || !studentName) return [];
      return actor.getStudentFeeRecords(studentName);
    },
    enabled: !!actor && !isFetching && !!studentName,
  });
}

export function useCreateFeeRecord() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: {
      studentName: string;
      amount: bigint;
      dueDate: bigint;
      receiptNumber: string;
    }) =>
      actor!.createFeeRecord(
        p.studentName,
        p.amount,
        p.dueDate,
        p.receiptNumber,
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["feeRecords"] }),
  });
}

export function useMarkFeePaid() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (receiptNumber: string) => actor!.markFeePaid(receiptNumber),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["feeRecords"] }),
  });
}

export function useClassHomework(formClass: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["homework", formClass],
    queryFn: async () => {
      if (!actor || !formClass) return [];
      return actor.getClassHomework(formClass);
    },
    enabled: !!actor && !isFetching && !!formClass,
  });
}

export function useCreateHomework() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: {
      subject: string;
      formClass: string;
      description: string;
      dueDate: bigint;
    }) =>
      actor!.createHomework(p.subject, p.formClass, p.description, p.dueDate),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["homework"] }),
  });
}

export function useClassTimetable(formClass: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["timetable", "class", formClass],
    queryFn: async () => {
      if (!actor || !formClass) return [];
      return actor.getClassTimetable(formClass);
    },
    enabled: !!actor && !isFetching && !!formClass,
  });
}

export function useTeacherTimetable(teacher: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["timetable", "teacher", teacher],
    queryFn: async () => {
      if (!actor || !teacher) return [];
      return actor.getTeacherTimetable(teacher);
    },
    enabled: !!actor && !isFetching && !!teacher,
  });
}

export function useVisitorLogs() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["visitors"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVisitorLogs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddVisitor() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: {
      name: string;
      purpose: string;
      contact: string;
      host: string;
    }) => actor!.addVisitor(p.name, p.purpose, p.contact, p.host),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["visitors"] }),
  });
}

export function useCheckOutVisitor() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => actor!.checkOutVisitor(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["visitors"] }),
  });
}

export function useStudentResults(student: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["results", student],
    queryFn: async () => {
      if (!actor || !student) return [];
      return actor.getStudentResults(student);
    },
    enabled: !!actor && !isFetching && !!student,
  });
}

export function useAddExamResult() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: {
      student: string;
      subject: string;
      marks: bigint;
      grade: string;
    }) => actor!.addExamResult(p.student, p.subject, p.marks, p.grade),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["results"] }),
  });
}

export function useAllDocuments() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDocuments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddDocument() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: {
      title: string;
      uploaderRole: SchoolRole;
      blob: ExternalBlob;
      category: Category;
    }) => actor!.addDocument(p.title, p.uploaderRole, p.blob, p.category),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents"] }),
  });
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (profile: {
      name: string;
      role: SchoolRole;
      classOrSubject?: string;
    }) =>
      actor!.saveCallerUserProfile({
        name: profile.name,
        role: profile.role,
        classOrSubject: profile.classOrSubject ? [profile.classOrSubject] : [],
      } as any),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userProfile"] }),
  });
}
