import {
 BrowserRouter,
 Routes,
 Route
} from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RoutinesPage from "../pages/RoutinesPage";
import EventsPage from "../pages/EventsPage";
import ExercisesPage from "../pages/ExcercisePage";
import ProgressPage from "../pages/ProgressPage";
import AdminAssignmentsPage from "../pages/admin/AdminAssignmentsPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminEventsPage from "../pages/admin/AdminEventsPage";
import AdminExercisesPage from "../pages/admin/AdminExercisesPage";
import AdminNotificationsPage from "../pages/admin/AdminNotificationsPage";
import AdminSpacesPage from "../pages/admin/AdminSpacesPage";
import AdminTrainersPage from "../pages/admin/AdminTrainersPage";
import AdminUserFormPage from "../pages/admin/AdminUserFormPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import NotFoundPage from "../pages/shared/NotFoundPage";
import TrainerDashboardPage from "../pages/trainer/TrainerDashboardPage";
import TrainerEventsPage from "../pages/trainer/TrainerEventsPage";
import TrainerRecommendationCreatePage from "../pages/trainer/TrainerRecommendationCreatePage";
import TrainerRecommendationsPage from "../pages/trainer/TrainerRecommendationsPage";
import TrainerSpacesPage from "../pages/trainer/TrainerSpacesPage";
import TrainerTemplatesPage from "../pages/trainer/TrainerTemplatesPage";
import TrainerUserDetailPage from "../pages/trainer/TrainerUserDetailPage";
import TrainerUserHistoryPage from "../pages/trainer/TrainerUserHistoryPage";
import TrainerUserProgressPage from "../pages/trainer/TrainerUserProgressPage";
import TrainerUserRecommendationsPage from "../pages/trainer/TrainerUserRecommendationsPage";
import TrainerUserRoutinesPage from "../pages/trainer/TrainerUserRoutinesPage";
import TrainerUsersPage from "../pages/trainer/TrainerUsersPage";
import TrainerUserStatsPage from "../pages/trainer/TrainerUserStatsPage";
import UnauthorizedPage from "../pages/shared/UnauthorizedPage";
import UserEventsPage from "../pages/user/EventsPage";
import UserExercisesPage from "../pages/user/ExercisesPage";
import UserHistoryPage from "../pages/user/HistoryPage";
import UserNotificationsPage from "../pages/user/NotificationsPage";
import UserProgressPage from "../pages/user/ProgressPage";
import UserRecommendationsPage from "../pages/user/RecommendationsPage";
import UserReportsPage from "../pages/user/ReportsPage";
import UserRoutineCreatePage from "../pages/user/RoutineCreatePage";
import UserRoutinesPage from "../pages/user/RoutinesPage";
import UserSpacesPage from "../pages/user/SpacesPage";
import UserStatsPage from "../pages/user/StatsPage";
import UserDashboardPage from "../pages/user/UserDashboardPage";
import type { RoleName } from "../types/auth";
import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "./RoleGuard";
import RootRedirect from "./RootRedirect";

const authenticatedRoles: RoleName[] = ["ADMIN", "USER"];

function AppRouter() {

 return (
  <BrowserRouter>

   <Routes>

    <Route
     path="/"
     element={<RootRedirect />}
    />

    <Route
     path="/login"
     element={<LoginPage />}
    />

    <Route
     path="/app"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["USER"]}>
        <UserDashboardPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/app/exercises"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["USER"]}>
        <UserExercisesPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/app/routines"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["USER"]}>
        <UserRoutinesPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/app/routines/new"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["USER"]}>
        <UserRoutineCreatePage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/app/progress"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["USER"]}>
        <UserProgressPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/app/history"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["USER"]}>
        <UserHistoryPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/app/stats"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["USER"]}>
        <UserStatsPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/app/recommendations"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["USER"]}>
        <UserRecommendationsPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/app/events"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["USER"]}>
        <UserEventsPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/app/spaces"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["USER"]}>
        <UserSpacesPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/app/reports"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["USER"]}>
        <UserReportsPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/app/notifications"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["USER"]}>
        <UserNotificationsPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/trainer"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["TRAINER"]}>
        <TrainerDashboardPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/trainer/users"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["TRAINER"]}>
        <TrainerUsersPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/trainer/users/:userId"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["TRAINER"]}>
        <TrainerUserDetailPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/trainer/users/:userId/routines"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["TRAINER"]}>
        <TrainerUserRoutinesPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/trainer/users/:userId/progress"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["TRAINER"]}>
        <TrainerUserProgressPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/trainer/users/:userId/history"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["TRAINER"]}>
        <TrainerUserHistoryPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/trainer/users/:userId/stats"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["TRAINER"]}>
        <TrainerUserStatsPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/trainer/users/:userId/recommendations"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["TRAINER"]}>
        <TrainerUserRecommendationsPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/trainer/recommendations"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["TRAINER"]}>
        <TrainerRecommendationsPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/trainer/recommendations/new"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["TRAINER"]}>
        <TrainerRecommendationCreatePage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/trainer/templates"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["TRAINER"]}>
        <TrainerTemplatesPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/trainer/events"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["TRAINER"]}>
        <TrainerEventsPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/trainer/spaces"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["TRAINER"]}>
        <TrainerSpacesPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/admin"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["ADMIN"]}>
        <AdminDashboardPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/admin/users"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["ADMIN"]}>
        <AdminUsersPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/admin/users/new"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["ADMIN"]}>
        <AdminUserFormPage mode="create" targetRoleName="USER" />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/admin/users/:id/edit"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["ADMIN"]}>
        <AdminUserFormPage mode="edit" targetRoleName="USER" />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/admin/trainers"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["ADMIN"]}>
        <AdminTrainersPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/admin/trainers/new"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["ADMIN"]}>
        <AdminUserFormPage mode="create" targetRoleName="TRAINER" />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/admin/trainers/:id/edit"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["ADMIN"]}>
        <AdminUserFormPage mode="edit" targetRoleName="TRAINER" />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/admin/assignments"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["ADMIN"]}>
        <AdminAssignmentsPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/admin/exercises"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["ADMIN"]}>
        <AdminExercisesPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/admin/events"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["ADMIN"]}>
        <AdminEventsPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/admin/spaces"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["ADMIN"]}>
        <AdminSpacesPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/admin/notifications"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={["ADMIN"]}>
        <AdminNotificationsPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/unauthorized"
     element={<UnauthorizedPage />}
    />

    <Route
     path="/routines"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={authenticatedRoles}>
        <RoutinesPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/events"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={authenticatedRoles}>
        <EventsPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/exercises"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={authenticatedRoles}>
        <ExercisesPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="/progress"
     element={
      <ProtectedRoute>
       <RoleGuard allowedRoles={authenticatedRoles}>
        <ProgressPage />
       </RoleGuard>
      </ProtectedRoute>
     }
    />

    <Route
     path="*"
     element={<NotFoundPage />}
    />

   </Routes>

  </BrowserRouter>
 );
}

export default AppRouter;
