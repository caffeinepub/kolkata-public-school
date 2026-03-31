import { Toaster } from "@/components/ui/sonner";
import AdminDashboard from "@/pages/AdminDashboard";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import ReceptionDashboard from "@/pages/ReceptionDashboard";
import StudentDashboard from "@/pages/StudentDashboard";
import TeacherDashboard from "@/pages/TeacherDashboard";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/portal/login",
  component: LoginPage,
});
const teacherRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/portal/teacher",
  component: TeacherDashboard,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/portal/admin",
  component: AdminDashboard,
});
const receptionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/portal/reception",
  component: ReceptionDashboard,
});
const studentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/portal/student",
  component: StudentDashboard,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  teacherRoute,
  adminRoute,
  receptionRoute,
  studentRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </>
  );
}
