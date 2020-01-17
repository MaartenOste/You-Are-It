import App from '../lib/App';
import LS from '../lib/core/LocalStorage';
import DataSeeder from '../lib/core/Dataseeder';

const createTemplate = require('../templates/create game.hbs');

export default () => {
  App.firebase.checkConnection();

  const ls = new LS(localStorage);
  const settings = [];

  // check if user
  App.firebase.checkUser();


  // render the template
  App.render(createTemplate());

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
