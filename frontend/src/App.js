import './App.css';
import { Provider } from 'react-redux'
import store from './store';
import UserEventsPage from './views/UserArea/Events/UserEventsPage';
import router from './router';
import { RouterProvider } from 'react-router';

function App() {

  return (
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>

  );
}

export default App;
