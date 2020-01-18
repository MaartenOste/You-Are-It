// import pages
import LoginPage from './pages/login';
import MainMenu from './pages/mainmenu';
import RegisterPage from './pages/register';
import HistoryPage from './pages/history';
import StatsPage from './pages/stats';
import PlayPage from './pages/play';
import JoinPage from './pages/join';
import CreatePage from './pages/create';
import LobbyPage from './pages/lobby';
import Game from './pages/game';
import ChoosePage from './pages/choose';
import OfflinePage from './pages/offline';

export default [
  { path: '/login', view: LoginPage },
  { path: '/mainmenu', view: MainMenu },
  { path: '/register', view: RegisterPage },
  { path: '/history', view: HistoryPage },
  { path: '/stats', view: StatsPage },
  { path: '/play', view: PlayPage },
  { path: '/join', view: JoinPage },
  { path: '/create game', view: CreatePage },
  { path: '/lobby', view: LobbyPage },
  { path: '/game', view: Game },
  { path: '/choose', view: ChoosePage },
  { path: '/offline', view: OfflinePage },
];
