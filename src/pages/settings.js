/**
 * The Home Page
 */

import App from '../lib/App';

const settingsTemplate = require('../templates/settings.hbs');

export default () => {
  // check if user
  App.firebase.checkUser();

  // render the template
  App.render(settingsTemplate());
};
