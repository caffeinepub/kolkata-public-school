import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface StudentDirectoryEntry {
    parentContact: string;
    name: string;
    rollNumber: bigint;
    formClass: string;
}
export type Time = bigint;
export interface DocumentMetadata {
    title: string;
    uploaderRole: SchoolRole;
    blob: ExternalBlob;
    category: Category;
}
export interface TimetableEntry {
    day: string;
    subject: string;
    teacher: string;
    formClass: string;
    timeSlot: string;
}
export interface VisitorLogEntry {
    contact: string;
    host: string;
    name: string;
    checkInTime: Time;
    checkOutTime?: Time;
    purpose: string;
}
export interface FeeRecord {
    studentName: string;
    paid: boolean;
    dueDate: Time;
    amount: bigint;
    receiptNumber: string;
}
export interface StaffDirectoryEntry {
    contact: string;
    name: string;
    subjectOrDepartment: string;
}
export interface Announcement {
    title: string;
    content: string;
    date: Time;
    category: Category;
}
export interface ExamResult {
    marks: bigint;
    subject: string;
    grade: string;
    student: string;
}
export interface Homework {
    subject: string;
    dueDate: Time;
    description: string;
    formClass: string;
}
export interface UserProfile {
    name: string;
    role: SchoolRole;
    classOrSubject?: string;
}
export enum Category {
    fee = "fee",
    academic = "academic",
    event = "event",
    general = "general"
}
export enum SchoolRole {
    admin = "admin",
    teacher = "teacher",
    reception = "reception",
    studentParent = "studentParent"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    _initializeAccessControlWithSecret(secret: string): Promise<undefined>;
    addDocument(title: string, uploaderRole: SchoolRole, blob: ExternalBlob, category: Category): Promise<void>;
    addExamResult(student: string, subject: string, marks: bigint, grade: string): Promise<void>;
    addStaff(name: string, subjectOrDepartment: string, contact: string): Promise<void>;
    addStudent(name: string, formClass: string, rollNumber: bigint, parentContact: string): Promise<void>;
    addVisitor(name: string, purpose: string, contact: string, host: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkOutVisitor(name: string): Promise<void>;
    createAnnouncement(title: string, content: string, category: Category): Promise<void>;
    createFeeRecord(studentName: string, amount: bigint, dueDate: Time, receiptNumber: string): Promise<void>;
    createHomework(subject: string, formClass: string, description: string, dueDate: Time): Promise<void>;
    createTimetableEntry(formClass: string, subject: string, teacher: string, day: string, timeSlot: string): Promise<void>;
    getAllAnnouncements(): Promise<Array<Announcement>>;
    getAllDocuments(): Promise<Array<DocumentMetadata>>;
    getAllStaff(): Promise<Array<StaffDirectoryEntry>>;
    getAllStudents(): Promise<Array<StudentDirectoryEntry>>;
    getAllVisitorLogs(): Promise<Array<VisitorLogEntry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClassHomework(formClass: string): Promise<Array<Homework>>;
    getClassTimetable(formClass: string): Promise<Array<TimetableEntry>>;
    getDocumentsByCategory(category: Category): Promise<Array<DocumentMetadata>>;
    getStudentFeeRecords(studentName: string): Promise<Array<FeeRecord>>;
    getStudentResults(student: string): Promise<Array<ExamResult>>;
    getTeacherTimetable(teacher: string): Promise<Array<TimetableEntry>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markFeePaid(receiptNumber: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
