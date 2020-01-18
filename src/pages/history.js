import App from '../lib/App';

const historyTemplate = require('../templates/history.hbs');

export default async () => {
  // check if internet connection
  App.firebase.checkConnection();

  // check if user
  App.firebase.checkUser();

  // render the template
  App.render(historyTemplate());
  document.body.style.backgroundImage = '';


  const history = await App.firebase.getHistory();
  // if no games played yet, show a text
  if (history.length === 0) {
    const nogames = document.createElement('div');
    nogames.innerText = 'No games played yet!';
    nogames.style.fontWeight = 'bold';
    document.getElementById('matchhistory').appendChild(nogames);
  }

  // show last 10 games
  for (let i = 0; i < 10; i++) {
    if (history[i]) {
      const container = document.createElement('div');
      container.className = 'm-historycontainer';

      const info = document.createElement('div');
      info.className = 'a-historyinfo';
      info.id = `info${i}`;
      info.innerText = 'click to show players';


      const data = document.createElement('div');
      data.className = 'm-data';

      const mode = document.createElement('div');
      mode.innerText = `${history[i].gamemode} game`.toUpperCase();
      mode.style.fontWeight = 'bold';

      const time = document.createElement('div');
      let { timeplayed } = history[i];
      const days = Math.floor(timeplayed / (3600 * 24));
      timeplayed -= days * 3600 * 24;
      const hrs = Math.floor(timeplayed / 3600);
      timeplayed -= hrs * 3600;
      const mnts = Math.floor(timeplayed / 60);
      timeplayed -= mnts * 60;
      time.innerText = `${mnts}m ${timeplayed}s`;

      const day = document.createElement('div');
      day.innerText = history[i].date;


      data.appendChild(mode);
      data.appendChild(time);
      data.appendChild(day);
      container.appendChild(data);
      container.appendChild(info);


      const players = document.createElement('div');
      players.className = 'm-players';
      players.id = `game${i}`;

      history[i].players.forEach((player) => {
        const playerdiv = document.createElement('div');
        playerdiv.innerText = player;
        players.appendChild(playerdiv);
      });

      container.appendChild(players);

      document.getElementById('matchhistory').appendChild(container);

      container.addEventListener('click', () => {
        if (document.getElementById(`game${i}`).style.display === 'block') {
          document.getElementById(`game${i}`).style.display = 'none';
          document.getElementById(`info${i}`).style.display = 'block';
        } else {
          document.getElementById(`game${i}`).style.display = 'block';
          document.getElementById(`info${i}`).style.display = 'none';
        }
      });
    }
  }
};
