// import pages
import HomePage from './pages/home';
import MapboxPage from './pages/mapbox';
import MainMenu from './pages/mainmenu';
import RegisterPage from './pages/register';
import SettingsPage from './pages/settings';
import StatsPage from './pages/stats';
import PlayPage from './pages/play';
import JoinPage from './pages/join';
import CreatePage from './pages/create';
import LobbyPage from './pages/lobby';
import Game from './pages/game';

export default [
  { path: '/home', view: HomePage },
  { path: '/mainmenu', view: MainMenu },
  { path: '/mapbox', view: MapboxPage },
  { path: '/register', view: RegisterPage },
  { path: '/settings', view: SettingsPage },
  { path: '/stats', view: StatsPage },
  { path: '/play', view: PlayPage },
  { path: '/join', view: JoinPage },
  { path: '/create game', view: CreatePage },
  { path: '/lobby', view: LobbyPage },
  { path: '/game', view: Game },
];
