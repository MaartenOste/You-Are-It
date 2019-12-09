import { SITE_TITLE } from '../consts';
import App from '../lib/App';

const homeTemplate = require('../templates/game.hbs');

export default () => {
  // set the title of this page
  const title = `${SITE_TITLE} is ready to go!`;

  // render the template
  App.render(homeTemplate({ title }));
};
