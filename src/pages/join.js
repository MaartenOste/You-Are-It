/* eslint-disable no-alert */
import { SITE_TITLE } from '../consts';
import App from '../lib/App';
import LocalStorage from '../lib/core/LocalStorage';

const joinTemplate = require('../templates/join.hbs');

export default () => {
  // set the title of this page
  const title = `${SITE_TITLE} is ready to go!`;

  // render the template
  App.render(joinTemplate({ title }));
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
