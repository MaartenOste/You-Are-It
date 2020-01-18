/* eslint-disable no-unused-vars */
/**
 * The Home Page
 */

import App from '../lib/App';

const historyTemplate = require('../templates/history.hbs');

export default async () => {
  App.firebase.checkConnection();

  // check if user
  App.firebase.checkUser();

  // render the template
  App.render(historyTemplate());
  document.body.style.backgroundImage = '';

  const history = await App.firebase.getHistory();
  if (history.length === 0) {
    const nogames = document.createElement('div');
    nogames.innerText = 'No games played yet!';
    nogames.style.fontWeight = 'bold';
    document.getElementById('matchhistory').appendChild(nogames);
  }


  history.forEach((game) => {
    const container = document.createElement('div');
    container.className = 'm-historycontainer';

    const data = document.createElement('div');
    data.className = 'm-data';

    const mode = document.createElement('div');
    mode.innerText = `${game.gamemode} game`.toUpperCase();
    mode.style.fontWeight = 'bold';

    const time = document.createElement('div');
    let { timeplayed } = game;
    const days = Math.floor(timeplayed / (3600 * 24));
    timeplayed -= days * 3600 * 24;
    const hrs = Math.floor(timeplayed / 3600);
    timeplayed -= hrs * 3600;
    const mnts = Math.floor(timeplayed / 60);
    timeplayed -= mnts * 60;
    time.innerText = `${mnts}m ${timeplayed}s`;

    const day = document.createElement('div');
    day.innerText = game.date;


    data.appendChild(mode);
    data.appendChild(time);
    data.appendChild(day);
    container.appendChild(data);


    const players = document.createElement('div');
    players.className = 'm-players';

    game.players.forEach((player) => {
      const playerdiv = document.createElement('div');
      playerdiv.innerText = player;
      players.appendChild(playerdiv);
    });

    container.appendChild(players);

    document.getElementById('matchhistory').appendChild(container);
  });
};
