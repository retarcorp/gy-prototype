import './App.css';
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
]);

function App() {

  return (
    <RouterProvider router={router}></RouterProvider>

  );
}

export default App;
