import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // =========================
  // Type Definitions & State
  // =========================

  type SchoolRole = {
    #teacher;
    #admin;
    #reception;
    #studentParent;
  };

  public type UserProfile = {
    name : Text;
    role : SchoolRole;
    classOrSubject : ?Text; // class for students, subject for teachers
  };

  type Category = {
    #general;
    #academic;
    #event;
    #fee;
  };

  type Announcement = {
    title : Text;
    content : Text;
    date : Time.Time;
    category : Category;
  };

  type TimetableEntry = {
    formClass : Text;
    subject : Text;
    teacher : Text;
    day : Text;
    timeSlot : Text;
  };

  type Homework = {
    subject : Text;
    formClass : Text;
    description : Text;
    dueDate : Time.Time;
  };

  type FeeRecord = {
    studentName : Text;
    amount : Nat;
    paid : Bool;
    dueDate : Time.Time;
    receiptNumber : Text;
  };

  type VisitorLogEntry = {
    name : Text;
    purpose : Text;
    contact : Text;
    host : Text;
    checkInTime : Time.Time;
    checkOutTime : ?Time.Time;
  };

  type StudentDirectoryEntry = {
    name : Text;
    formClass : Text;
    rollNumber : Nat;
    parentContact : Text;
  };

  type StaffDirectoryEntry = {
    name : Text;
    subjectOrDepartment : Text;
    contact : Text;
  };

  type ExamResult = {
    student : Text;
    subject : Text;
    marks : Nat;
    grade : Text;
  };

  type DocumentMetadata = {
    title : Text;
    uploaderRole : SchoolRole;
    blob : Storage.ExternalBlob;
    category : Category;
  };

  module DocumentMetadata {
    public func compare(doc1 : DocumentMetadata, doc2 : DocumentMetadata) : Order.Order {
      Text.compare(doc1.title, doc2.title);
    };
  };

  // ==============
  // Core State
  // ==============

  let announcements = Map.empty<Nat, Announcement>();
  let timetableEntries = Map.empty<Nat, TimetableEntry>();
  let homeworkAssignments = Map.empty<Nat, Homework>();
  let feeRecords = Map.empty<Nat, FeeRecord>();
  let visitorLogs = Map.empty<Nat, VisitorLogEntry>();
  let studentDirectory = Map.empty<Nat, StudentDirectoryEntry>();
  let staffDirectory = Map.empty<Nat, StaffDirectoryEntry>();
  let examResults = Map.empty<Nat, ExamResult>();
  let documents = Map.empty<Nat, DocumentMetadata>();

  let blobIdCounter = Map.empty<Text, Nat>();
  let counters = Map.fromIter<Text, Nat>(["announcement", "timetable", "homework", "feeRecord", "visitorLog", "studentEntry", "staffEntry", "examResult", "document"].values().zip(Array.repeat(0, 9).values()));

  // ID Management
  func getNextId(type_ : Text) : Nat {
    let id = switch (counters.get(type_)) {
      case (null) { Runtime.trap("Counter for " # type_ # " not found") };
      case (?id) { id };
    };
    counters.add(type_, id + 1);
    id;
  };

  include MixinStorage();

  // ==========
  // Auth System & User Management
  // ==========

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Helper function to get school role
  func getSchoolRole(caller : Principal) : ?SchoolRole {
    switch (userProfiles.get(caller)) {
      case (?profile) { ?profile.role };
      case (null) { null };
    };
  };

  // Helper function to check if caller is admin
  func isSchoolAdmin(caller : Principal) : Bool {
    switch (getSchoolRole(caller)) {
      case (?#admin) { true };
      case (_) { false };
    };
  };

  // Helper function to check if caller is teacher
  func isTeacher(caller : Principal) : Bool {
    switch (getSchoolRole(caller)) {
      case (?#teacher) { true };
      case (_) { false };
    };
  };

  // Helper function to check if caller is reception
  func isReception(caller : Principal) : Bool {
    switch (getSchoolRole(caller)) {
      case (?#reception) { true };
      case (_) { false };
    };
  };

  // Helper function to check if caller is teacher or admin
  func isTeacherOrAdmin(caller : Principal) : Bool {
    switch (getSchoolRole(caller)) {
      case (?#teacher) { true };
      case (?#admin) { true };
      case (_) { false };
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // =====================
  // Announcement Functions
  // =====================

  public shared ({ caller }) func createAnnouncement(title : Text, content : Text, category : Category) : async () {
    if (not isSchoolAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can create announcements");
    };

    let id = getNextId("announcement");
    let announcement : Announcement = {
      title;
      content;
      date = Time.now();
      category;
    };
    announcements.add(id, announcement);
  };

  public query ({ caller }) func getAllAnnouncements() : async [Announcement] {
    // All roles can read announcements (including guests)
    announcements.values().toArray();
  };

  // =====================
  // Timetable Management
  // =====================

  public shared ({ caller }) func createTimetableEntry(formClass : Text, subject : Text, teacher : Text, day : Text, timeSlot : Text) : async () {
    if (not isSchoolAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can create timetable entries");
    };

    let id = getNextId("timetable");
    let entry : TimetableEntry = {
      formClass;
      subject;
      teacher;
      day;
      timeSlot;
    };
    timetableEntries.add(id, entry);
  };

  public query ({ caller }) func getClassTimetable(formClass : Text) : async [TimetableEntry] {
    // Teachers and students can view timetables
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view timetables");
    };
    timetableEntries.values().toArray().filter(func(entry) { entry.formClass == formClass });
  };

  public query ({ caller }) func getTeacherTimetable(teacher : Text) : async [TimetableEntry] {
    // Teachers and students can view timetables
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view timetables");
    };
    timetableEntries.values().toArray().filter(func(entry) { entry.teacher == teacher });
  };

  // =====================
  // Homework Management
  // =====================

  public shared ({ caller }) func createHomework(subject : Text, formClass : Text, description : Text, dueDate : Time.Time) : async () {
    if (not isTeacher(caller)) {
      Runtime.trap("Unauthorized: Only teachers can post homework");
    };

    let id = getNextId("homework");
    let homework : Homework = {
      subject;
      formClass;
      description;
      dueDate;
    };
    homeworkAssignments.add(id, homework);
  };

  public query ({ caller }) func getClassHomework(class_ : Text) : async [Homework] {
    // Students can view homework
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view homework");
    };
    homeworkAssignments.values().toArray().filter(func(hw) { hw.formClass == class_ });
  };

  // =====================
  // Fee Records Management
  // =====================

  public shared ({ caller }) func createFeeRecord(studentName : Text, amount : Nat, dueDate : Time.Time, receiptNumber : Text) : async () {
    if (not isSchoolAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can manage fee records");
    };

    let id = getNextId("feeRecord");
    let record : FeeRecord = {
      studentName;
      amount;
      paid = false;
      dueDate;
      receiptNumber;
    };
    feeRecords.add(id, record);
  };

  public shared ({ caller }) func markFeePaid(receiptNumber : Text) : async () {
    if (not isSchoolAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can update fee records");
    };

    let id = findFeeRecordIdByReceipt(receiptNumber);
    switch (feeRecords.get(id)) {
      case (null) { Runtime.trap("Fee record not found") };
      case (?record) {
        let updatedRecord = { record with paid = true };
        feeRecords.add(id, updatedRecord);
      };
    };
  };

  func findFeeRecordIdByReceipt(receiptNumber : Text) : Nat {
    var foundId : ?Nat = null;
    feeRecords.forEach(
      func(id, record) {
        if (record.receiptNumber == receiptNumber) {
          foundId := ?id;
        };
      }
    );

    switch (foundId) {
      case (?id) { id };
      case (null) { Runtime.trap("Fee record not found") };
    };
  };

  public query ({ caller }) func getStudentFeeRecords(studentName : Text) : async [FeeRecord] {
    // Students/parents and admins can view fee records
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view fee records");
    };
    feeRecords.values().toArray().filter(func(rec) { rec.studentName == studentName });
  };

  // ===================
  // Visitor Log
  // ===================

  public shared ({ caller }) func addVisitor(name : Text, purpose : Text, contact : Text, host : Text) : async () {
    if (not isReception(caller)) {
      Runtime.trap("Unauthorized: Only reception can add visitors");
    };

    let id = getNextId("visitorLog");
    let entry : VisitorLogEntry = {
      name;
      purpose;
      contact;
      host;
      checkInTime = Time.now();
      checkOutTime = null;
    };
    visitorLogs.add(id, entry);
  };

  public shared ({ caller }) func checkOutVisitor(name : Text) : async () {
    if (not isReception(caller)) {
      Runtime.trap("Unauthorized: Only reception can check out visitors");
    };

    let id = findVisitorIdByName(name);
    switch (visitorLogs.get(id)) {
      case (null) { Runtime.trap("Visitor not found") };
      case (?visitor) {
        let updatedVisitor = { visitor with checkOutTime = ?Time.now() };
        visitorLogs.add(id, updatedVisitor);
      };
    };
  };

  func findVisitorIdByName(name : Text) : Nat {
    var foundId : ?Nat = null;
    visitorLogs.forEach(
      func(id, visitor) {
        if (visitor.name == name) {
          foundId := ?id;
        };
      }
    );
    switch (foundId) {
      case (?id) { id };
      case (null) { Runtime.trap("Visitor not found") };
    };
  };

  public query ({ caller }) func getAllVisitorLogs() : async [VisitorLogEntry] {
    // Reception and admins can view visitor logs
    if (not (isReception(caller) or isSchoolAdmin(caller))) {
      Runtime.trap("Unauthorized: Only reception and admins can view visitor logs");
    };
    visitorLogs.values().toArray();
  };

  // ===================
  // Directory Management
  // ===================

  public shared ({ caller }) func addStudent(name : Text, formClass : Text, rollNumber : Nat, parentContact : Text) : async () {
    if (not isSchoolAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can add students");
    };

    let id = getNextId("studentEntry");
    let entry : StudentDirectoryEntry = {
      name;
      formClass;
      rollNumber;
      parentContact;
    };
    studentDirectory.add(id, entry);
  };

  public shared ({ caller }) func addStaff(name : Text, subjectOrDepartment : Text, contact : Text) : async () {
    if (not isSchoolAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can add staff");
    };

    let id = getNextId("staffEntry");
    let entry : StaffDirectoryEntry = {
      name;
      subjectOrDepartment;
      contact;
    };
    staffDirectory.add(id, entry);
  };

  public query ({ caller }) func getAllStudents() : async [StudentDirectoryEntry] {
    // All authenticated users can view student directory
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view student directory");
    };
    studentDirectory.values().toArray();
  };

  public query ({ caller }) func getAllStaff() : async [StaffDirectoryEntry] {
    // All authenticated users can view staff directory
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view staff directory");
    };
    staffDirectory.values().toArray();
  };

  // ======================
  // Exam Results Management
  // ======================

  public shared ({ caller }) func addExamResult(student : Text, subject : Text, marks : Nat, grade : Text) : async () {
    if (not isTeacherOrAdmin(caller)) {
      Runtime.trap("Unauthorized: Only teachers and admins can add results");
    };

    let id = getNextId("examResult");
    let result : ExamResult = {
      student;
      subject;
      marks;
      grade;
    };
    examResults.add(id, result);
  };

  public query ({ caller }) func getStudentResults(student : Text) : async [ExamResult] {
    // Students and authenticated users can view results
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view exam results");
    };
    examResults.values().toArray().filter(func(res) { res.student == student });
  };

  // ===========================
  // Document Management
  // ===========================

  public shared ({ caller }) func addDocument(title : Text, uploaderRole : SchoolRole, blob : Storage.ExternalBlob, category : Category) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be logged in to add documents");
    };

    let id = getNextId("document");
    let doc : DocumentMetadata = {
      title;
      uploaderRole;
      blob;
      category;
    };
    documents.add(id, doc);
  };

  public query ({ caller }) func getAllDocuments() : async [DocumentMetadata] {
    // All users can view documents
    documents.values().toArray().sort();
  };

  public query ({ caller }) func getDocumentsByCategory(category : Category) : async [DocumentMetadata] {
    // All users can view documents
    documents.values().toArray().filter(func(doc) { doc.category == category });
  };
};
