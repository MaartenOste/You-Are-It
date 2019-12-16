
import { SITE_TITLE } from '../consts';
import App from '../lib/App';

const homeTemplate = require('../templates/mainmenu.hbs');

export default () => {
  // set the title of this page
  const title = `${SITE_TITLE} is ready to go!`;

  // render the template
  App.render(homeTemplate({ title }));
  if (document.body.style.backgroundColor === 'rgb(68, 133, 199)') {
    document.getElementById('theme').style.backgroundColor = '#b92234';
  }

  document.getElementById('theme').addEventListener('click', () => {
    if (document.body.style.backgroundColor === 'rgb(185, 34, 52)' || document.body.style.backgroundColor === '') {
      document.body.style.backgroundColor = '#4485c7';
      document.getElementById('theme').style.backgroundColor = '#b92234';
    } else {
      document.body.style.backgroundColor = '#b92234';
      document.getElementById('theme').style.backgroundColor = '#4485c7';
    }
  });
};
