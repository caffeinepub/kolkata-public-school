# Kolkata Public School Website

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- Public homepage with school branding, hero section, announcements, role-based portal tiles, campus highlights, and footer
- 4 role-based portals: Teachers, Admin, Reception, Students/Parents
- Role-based access control (login/logout per role)
- Teachers portal: view class schedules, student list, upload assignments/notes, view announcements
- Admin portal: manage announcements, manage staff, manage students, view fee records, upload documents
- Reception portal: visitor log, manage inquiries, daily attendance summary, fee payment status
- Students/Parents portal: view timetable, homework, fee receipts, exam results, announcements
- Announcements system (admin posts, all roles can view)
- Fee records management (admin manages, parents/reception view)
- File/document upload support (assignments, notices)
- Premium UI: warm beige/navy/gold design, serif headings, glassmorphism cards

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: roles (Teacher, Admin, Reception, Student/Parent), user management, announcements CRUD, fee records, timetable, homework posts, visitor log, document metadata
2. Frontend: public homepage, login modal (role selector), 4 dashboard pages each with sidebar navigation and role-specific features
3. Authorization component for role-based access
4. Blob-storage component for file uploads
