/* eslint-disable max-len */
import App from '../lib/App';
import LocalStorage from '../lib/core/LocalStorage';

const chooseTemplate = require('../templates/choose.hbs');

export default () => {
  App.firebase.checkConnection();

  // render the template
  App.render(chooseTemplate());

  const ls = new LocalStorage(localStorage);
  function chooseSide(event) {
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
    } else {
      document.addEventListener('click', chooseSide);
    }
  });
};
