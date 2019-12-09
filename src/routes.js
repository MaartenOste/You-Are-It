// import pages
import HomePage from './pages/home';
import MapboxPage from './pages/mapbox';
import MainMenu from './pages/mainmenu';
import RegisterPage from './pages/register';
import SettingsPage from './pages/settings';
import StatsPage from './pages/stats';

export default [
  { path: '/home', view: HomePage },
  { path: '/mainmenu', view: MainMenu },
  { path: '/mapbox', view: MapboxPage },
  { path: '/register', view: RegisterPage },
  { path: '/settings', view: SettingsPage },
  { path: '/stats', view: StatsPage },
];
