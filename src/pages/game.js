/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import { SITE_TITLE, MAPBOX_API_KEY } from '../consts';
import App from '../lib/App';
import MapBox from '../lib/core/MapBox';
import DataSeeder from '../lib/core/Dataseeder';
import Storage from '../lib/core/LocalStorage';
import Game from '../lib/core/Game';

const gameTemplate = require('../templates/game.hbs');

export default async () => {
  const title = `${SITE_TITLE} is ready to go!`;

  App.render(gameTemplate({ title }));

  const ls = new Storage(localStorage);

  if (ls.getArray('GameSettings')[1] === 'normal') {
    Game.normalGame();
  } else {
    Game.battleGame();
  }
};
