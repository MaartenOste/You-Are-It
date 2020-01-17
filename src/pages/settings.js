/**
 * The Home Page
 */

import App from '../lib/App';

const settingsTemplate = require('../templates/settings.hbs');

export default () => {
  App.firebase.checkConnection();

  // check if user
  App.firebase.checkUser();

  // render the template
  App.render(settingsTemplate());
};
