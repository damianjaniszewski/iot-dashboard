import Login from './screens/Login';
import Main from './components/Main';
import Dashboard from './screens/Dashboard';
import Events from './screens/Events';
import Sensor from './screens/Sensor';
// import Sensors from './screens/Sensors';
import NotFound from './screens/NotFound';

export default {
  path: '/',
  component: Main,
  childRoutes: [
    { path: 'login', component: Login },
    { path: 'dashboard', component: Dashboard },
    { path: 'sensor/:id', component: Sensor },
    { path: 'events', component: Events },
    // { path: 'sensors', component: Sensors },
    { path: '*', component: NotFound }
  ],
  indexRoute: { component: Dashboard }
};
