/* eslint-disable no-alert */
import App from '../lib/App';

const joinTemplate = require('../templates/offline.hbs');

export default () => {
  App.render(joinTemplate());

  document.getElementById('retry').addEventListener('click', () => {
    App.firebase.reCheckConnection();
  });
};
