/* eslint-disable max-len */
import { SITE_TITLE } from '../consts';
import App from '../lib/App';
import LocalStorage from '../lib/core/LocalStorage';

const chooseTemplate = require('../templates/choose.hbs');

export default () => {
  // set the title of this page
  const title = `${SITE_TITLE} is ready to go!`;

  // render the template
  App.render(chooseTemplate({ title }));

  const ls = new LocalStorage(localStorage);
  function chooseSide(event) {
    console.log(`clientX: ${event.clientX} - clientY: ${event.clientY} - height ${window.screen.height}`);
    if (event.clientX > window.screen.width / 2 && event.clientY > window.screen.height / 2) {
      ls.setItem('theme', 'bad');
      App.router.navigate('/login');
      document.removeEventListener('click', chooseSide);
    } else if (event.clientX < window.screen.width / 2 && event.clientY < window.screen.height / 2) {
      ls.setItem('theme', 'good');
      App.router.navigate('/login');
      document.removeEventListener('click', chooseSide);
    }
  }
  App.firebase.getAuth().onAuthStateChanged((user) => {
    if (user) {
      App.router.navigate('/mainmenu');
      console.log(`logged in with: ${App.firebase.getAuth().currentUser.email}`);
    }
  });
  document.addEventListener('click', chooseSide);
};
