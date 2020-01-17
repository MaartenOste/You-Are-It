import App from '../lib/App';

const playTemplate = require('../templates/play.hbs');

export default () => {
  App.firebase.checkConnection();

  // check if user
  App.firebase.checkUser();

  // render the template
  App.render(playTemplate());
};
