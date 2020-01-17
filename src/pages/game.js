/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import { MAPBOX_API_KEY } from '../consts';
import App from '../lib/App';
import MapBox from '../lib/core/MapBox';
import DataSeeder from '../lib/core/Dataseeder';
import Storage from '../lib/core/LocalStorage';
import Game from '../lib/core/Game';

const gameTemplate = require('../templates/game.hbs');

export default async () => {
  App.firebase.checkUser();

  App.render(gameTemplate());

  const ls = new Storage(localStorage);

  if (ls.getArray('GameSettings')[1] === 'normal') {
    Game.normalGame();
  } else {
    Game.battleGame();
  }
};
