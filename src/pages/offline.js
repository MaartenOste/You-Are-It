import App from '../lib/App';

const offlineTemplate = require('../templates/offline.hbs');

export default () => {
  App.render(offlineTemplate());

  document.getElementById('retry').addEventListener('click', () => {
    App.firebase.reCheckConnection();
  });
};
