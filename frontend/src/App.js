import './App.css';
import AdminEventsBlockPage from './views/AdminArea/AdminEvents/AdminEventsBlockPage';
import AdminManageEventPage from './views/AdminArea/AdminEvents/AdminManageEventPage';
import AdminArea from './views/AdminArea/AdminPage';
import withAdminWrapper from './views/AdminArea/AdminWrapper';
import Facade from './views/Facade/Facade';
import RotationExample from './views/RotationExample/RotationExample';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Provider } from 'react-redux'
import store from './store';

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
    element: withAdminWrapper(AdminEventsBlockPage)()
  }, {
    path: "/admin/events/:id/edit",
    element: withAdminWrapper(AdminManageEventPage)()
  }, {
    path: "/admin/events/create",
    element: withAdminWrapper(AdminManageEventPage)()
  }, {
    path: "/admin/events/:id",
    element: withAdminWrapper(() => <div>Event Dashboard - TBD</div>)()
  }
]);

function App() {

  return (
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>

  );
}

export default App;
