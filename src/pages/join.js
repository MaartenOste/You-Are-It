/* eslint-disable no-alert */
import App from '../lib/App';
import LocalStorage from '../lib/core/LocalStorage';

const joinTemplate = require('../templates/join.hbs');

export default () => {
  App.firebase.checkUser();
  // render the template
  App.render(joinTemplate());
  const ls = new LocalStorage(localStorage);
  ls.setItem('UserType', 'player');

  document.getElementById('join').addEventListener('click', () => {
    if (document.getElementById('code').value.length === 4) {
      const code = document.getElementById('code').value.toUpperCase();
      ls.setItem('Code', code);
      const data = { lobbycode: code };
      App.firebase.setStat(App.firebase.getAuth().currentUser.uid, data);
      App.router.navigate('lobby');
    } else { window.alert('The code has to be 4 letters'); }
  });
};
