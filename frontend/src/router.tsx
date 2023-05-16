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
    element: (() => withAdminWrapper(AdminEventsBlockPage)()) as unknown as ReactNode
  }, {
    path: "/admin/events/:id/edit",
    element: (() => withAdminWrapper(AdminManageEventPage)()) as unknown as ReactNode
  }, {
    path: "/admin/events/create",
    element: (() => withAdminWrapper(AdminManageEventPage)()) as unknown as ReactNode
  }, {
    path: "/admin/events/:id",
    element: (() => withAdminWrapper(() => <div>Event Dashboard - TBD</div>)()) as unknown as ReactNode
  }, {
    path: '/user/onboarding',
    element: <OnboardingPage />
  }, {
    path: '/user/events/',
    element: <UserEventsPage />
  }, {
    path: '/user/events/:id',
    element: <EventPage />,
  }
]);

export default router;