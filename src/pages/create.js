import { SITE_TITLE } from '../consts';
import App from '../lib/App';
import LS from '../lib/core/LocalStorage';
import DataSeeder from '../lib/core/Dataseeder';

const createTemplate = require('../templates/create game.hbs');

export default () => {
  const ls = new LS(localStorage);
  const settings = [];

  // set the title of this page
  const title = `${SITE_TITLE} is ready to go!`;

  // render the template
  App.render(createTemplate({ title }));

  const buttons = document.getElementsByClassName('a-button_menu');
  ls.setItem('UserType', 'mod');

  buttons[0].addEventListener('click', () => {
    if (document.getElementById('persons').value === '') {
      settings.push(5);
    } else {
      settings.push(document.getElementById('persons').value);
    }
    settings.push(document.getElementById('gamemode').options[document.getElementById('gamemode').selectedIndex].value);
    settings.push(document.getElementById('timer').options[document.getElementById('timer').selectedIndex].value);
    if (document.getElementById('radius').value === '') {
      settings.push(1);
    } else {
      settings.push(document.getElementById('radius').value);
    }
    const code = DataSeeder.randomCode();
    const data = { lobbycode: code };
    App.firebase.setStat(App.firebase.getAuth().currentUser.uid, data);
    ls.setItem('Code', code);
    ls.setArray('GameSettings', settings);
  });
};
