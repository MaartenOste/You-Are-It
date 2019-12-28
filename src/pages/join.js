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
      ls.setItem('Code', document.getElementById('code').value);
      App.router.navigate('lobby');
    } else { window.alert('The code has to be 4 letters'); }
  });
};
