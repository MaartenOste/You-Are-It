import App from '../lib/App';
import Storage from '../lib/core/LocalStorage';
import Game from '../lib/core/Game';

const gameTemplate = require('../templates/game.hbs');

export default async () => {
  // check if internet connection
  App.firebase.checkConnection();

  // check if user
  App.firebase.checkUser();

  App.render(gameTemplate());

  const ls = new Storage(localStorage);

  if (ls.getArray('GameSettings')[1] === 'normal') {
    Game.normalGame();
  } else {
    Game.battleGame();
  }
};
