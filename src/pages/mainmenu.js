
import { SITE_TITLE } from '../consts';
import App from '../lib/App';
import LocalStorage from '../lib/core/LocalStorage';

const homeTemplate = require('../templates/mainmenu.hbs');

export default () => {
  const ls = new LocalStorage(localStorage);
  // set the title of this page
  const title = `${SITE_TITLE} is ready to go!`;

  // render the template
  App.render(homeTemplate({ title }));
  if (ls.getItem('theme') === 'good') {
    document.body.style.backgroundColor = '#4485c7';
    document.getElementById('theme').style.backgroundColor = '#b92234';
  } else {
    document.body.style.backgroundColor = '#b92234';
    document.getElementById('theme').style.backgroundColor = '#4485c7';
  }

  document.getElementById('theme').addEventListener('click', () => {
    if (ls.getItem('theme') === 'bad') {
      document.body.style.backgroundColor = '#4485c7';
      document.getElementById('theme').style.backgroundColor = '#b92234';
      ls.setItem('theme', 'good');
    } else {
      document.body.style.backgroundColor = '#b92234';
      document.getElementById('theme').style.backgroundColor = '#4485c7';
      ls.setItem('theme', 'bad');
    }
  });
};
