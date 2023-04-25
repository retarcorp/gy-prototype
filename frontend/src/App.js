import './App.css';
import AdminArea from './views/AdminArea/AdminPage';
import Facade from './views/Facade/Facade';
import RotationExample from './views/RotationExample/RotationExample';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

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
]);

function App() {

  return (
    <RouterProvider router={router}></RouterProvider>

  );
}

export default App;
