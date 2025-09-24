import { createBrowserRouter } from "react-router-dom";

import RootLayout from "./service-provider/layouts/RootLayout";

import Login from "./service-provider/pages/auth/Login";
import SignUp from "./booking/pages/auth/SignUp";
import BookingPage from "./booking/pages/BookingPage";
import DashboardHome from "./service-provider/pages/dashboard/Home";
import Appointments from "./service-provider/pages/appointments/Appointments";
import AppointmentForm from "./service-provider/pages/appointments/AppointmentForm";
import AppointmentDetail from "./service-provider/pages/appointments/AppointmentDetail";
import Clients from "./service-provider/pages/clients/Clients";
import AddClient from "./service-provider/pages/clients/AddClient";
import EditClient from "./service-provider/pages/clients/EditClient";
import ClientDetails from "./service-provider/pages/clients/ClientDetail";
import ServicesList from "./service-provider/pages/services/ServicesList";
import AddService from "./service-provider/pages/services/AddService";
import ServiceDetail from "./service-provider/pages/services/ServiceDetail";
import Availability from "./service-provider/pages/availability/Availability";
import BusinessProfile from "./service-provider/pages/Profile/BusinessProfile";
import BusinessSettings from "./service-provider/pages/settings/BusinessSettings";
import PaymentSetup from "./service-provider/pages/settings/PaymentSetup";
import BookingPreferencesForm from "./service-provider/pages/settings/BookingPreferenceForm";
import StaffList from "./service-provider/pages/staff/StaffList";
import StaffForm from "./service-provider/components/StaffForm";
import StaffDetail from "./service-provider/pages/staff/StaffDetail";
import PaymentMethods from "./service-provider/pages/Payment/PaymentMethods";
import Notifications from "./service-provider/pages/notifications/Notifications";
import BookingLayout from "./booking/layouts/BookingLayout";
import ServiceListing from "./booking/pages/services/ServiceListing";
import ServiceListingDetails from "./booking/pages/services/ServiceListingDetails";
import BookingConfirmation from "./booking/pages/BookingConfirmation";
import UserDashboard from "./booking/pages/UserDashboard";
import AccountSettings from "./booking/pages/AccountSettings";
import NotificationsSettings from "./service-provider/pages/notifications/NotificationsSettings";
import SecuritySettings from "./service-provider/pages/settings/SecuritySettings";
import CalenderIntegration from "./service-provider/pages/settings/CalenderIntegration";

const router = createBrowserRouter([
  {
    path: "/",
    element: <BookingLayout />,
    children: [
      {
        path: "",
        element: <BookingPage />,
      },
      {
        path: "/book-services",
        element: <ServiceListing />,
      },
      { path: "sign-up", element: <SignUp /> },
      {
        path: "/booking/:id",
        element: <ServiceListingDetails />,
      },
      {
        path: "/booking-confirmation",
        element: <BookingConfirmation />,
      },
      {
        path: "/user-dashboard",
        element: <UserDashboard />,
      },
      {
        path: "/account-settings",
        element: <AccountSettings />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <RootLayout />,
    children: [
      {
        path: "",
        index: true,
        element: <DashboardHome />,
      },
      { path: "login", element: <Login /> },
      {
        path: "appointments",
        element: <Appointments />,
      },
      {
        path: "appointments/new",
        element: <AppointmentForm />,
      },
      {
        path: "appointments/:id",
        element: <AppointmentDetail />,
      },
      {
        path: "clients",
        element: <Clients />,
      },
      {
        path: "clients/new",
        element: <AddClient />,
      },
      {
        path: "clients/:id",
        element: <ClientDetails />,
      },
      {
        path: "clients/:id/edit",
        element: <EditClient />,
      },
      {
        path: "services",
        element: <ServicesList />,
      },
      {
        path: "services/new",
        element: <AddService />,
      },
      {
        path: "services/:id",
        element: <ServiceDetail />,
      },
      {
        path: "availability",
        element: <Availability />,
      },
      {
        path: "staff",
        element: <StaffList />,
      },
      {
        path: "staff/new",
        element: <StaffForm />,
      },
      {
        path: "staff/:id",
        element: <StaffDetail />,
      },
      {
        path: "payments",
        element: <PaymentMethods />,
      },
      {
        path: "profile",
        element: <BusinessProfile />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "notifications/settings",
        element: <NotificationsSettings />,
      },
      {
        path: "settings",
        element: <BusinessSettings />,
      },
      {
        path: "settings/security",
        element: <SecuritySettings />,
      },
      {
        path: "settings/calender",
        element: <CalenderIntegration />,
      },
      {
        path: "settings/booking-preference",
        element: <BookingPreferencesForm />,
      },
      {
        path: "settings/payment-setup",
        element: <PaymentSetup />,
      },
    ],
  },
]);

export default router;
