/**
 * The Home Page
 */

import { SITE_TITLE } from '../consts';
import App from '../lib/App';
import LocalStorage from '../lib/core/LocalStorage';

const homeTemplate = require('../templates/home.hbs');

export default () => {
  // set the title of this page
  const title = `${SITE_TITLE} is ready to go!`;

  // render the template
  App.render(homeTemplate({ title }));
  const ls = new LocalStorage(localStorage);
  console.log(ls.getItem('theme'));
  if (ls.getItem('theme') === 'undefined' || ls.getItem('theme') === 'bad') {
    const badcolor = 'rgb(185, 34, 52)';
    document.body.style.backgroundColor = badcolor;
    ls.setItem('theme', 'bad');
  } else {
    const goodcolor = '#4485c7';
    document.body.style.backgroundColor = goodcolor;
    ls.setItem('theme', 'good');
  }
};
