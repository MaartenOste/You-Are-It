import { SITE_TITLE } from '../consts';
import App from '../lib/App';
import DataSeeder from '../lib/core/Dataseeder';
import LocalStorage from '../lib/core/LocalStorage';

const lobbyTemplate = require('../templates/lobby.hbs');

export default async () => {
  // set the title of this page
  const title = `${SITE_TITLE} is ready to go!`;

  // render the template
  App.render(lobbyTemplate({ title }));

  const ls = new LocalStorage(localStorage);
  const d = new DataSeeder();

  if (ls.getItem('UserType') === 'player') {
    ls.setArray('GameSettings', [5 + Math.floor(Math.random() * 20), 'normal', 10, 5]);
    document.getElementById('code').innerHTML = `CODE: ${ls.getItem('Code').toUpperCase()}`;
  } else {
    document.getElementById('code').innerHTML = `CODE: ${d.randomCode().toUpperCase()}`;
  }

  const profiles = await d.randomPersons(ls.getArray('GameSettings')[0]);

  profiles.forEach((name) => {
    const div = document.createElement('div');
    div.className = 'm-setting';
    const div2 = document.createElement('div');
    div2.className = 'a-statlabel';
    div2.innerText = name;
    div.appendChild(div2);
    document.getElementsByClassName('m-players')[0].appendChild(div);
  });

  document.body.style.backgroundImage = '';

  document.getElementsByClassName('a-title')[0].innerText = `${ls.getArray('GameSettings')[1]} mode`;
};
