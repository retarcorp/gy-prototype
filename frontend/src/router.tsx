import { createBrowserRouter } from "react-router-dom";
import React, { ReactNode } from 'react';
import Facade from "./views/Facade/Facade";
import RotationExample from "./views/RotationExample/RotationExample";
import AdminArea from './views/AdminArea/AdminPage';
import withAdminWrapper from "./views/AdminArea/AdminWrapper";
import AdminEventsBlockPage from './views/AdminArea/AdminEvents/AdminEventsBlockPage';
import AdminManageEventPage from './views/AdminArea/AdminEvents/AdminManageEventPage';
import UserEventsPage from "./views/UserArea/Events/UserEventsPage";
import OnboardingPage from "./views/UserArea/Onboarding/OnboardingPage";
import EventPage from "./views/UserArea/EventProcess/EventPage";
import { CreateEventPage, UpdateEventPage } from "./views/AdminArea/AdminEvents/UpsertEventPage";
import AdminEventDashboardPage from "./views/AdminArea/EventDashboard/AdminEventDashboardPage";
import GamePage from "./views/UserArea/EventProcess/GamePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Facade></Facade>,
  },
  {
    path: "/rotation-example",
    element: <RotationExample></RotationExample>,
  },
  {
    path: "/admin",
    element: <AdminArea />,
  },
  {
    path: "/admin/events",
    element: <AdminEventsBlockPage />,
  }, {
    path: "/admin/events/edit/:id",
    element: <UpdateEventPage />
  }, {
    path: "/admin/events/create",
    element: <CreateEventPage />
  }, {
    path: "/admin/events/:id",
    element: <AdminEventDashboardPage />
  }, {
    path: '/user/onboarding',
    element: <OnboardingPage />
  }, {
    path: '/user/events/',
    element: <UserEventsPage />
  }, {
    path: '/user/events/:id',
    element: <EventPage />,
  }, {
    path: '/user/events/:id/game',
    element: <GamePage />
  }
]);

export default router;