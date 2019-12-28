
import { SITE_TITLE } from '../consts';
import App from '../lib/App';
import LocalStorage from '../lib/core/LocalStorage';

const mainmenuTemplate = require('../templates/mainmenu.hbs');

export default () => {
  const ls = new LocalStorage(localStorage);
  // set the title of this page
  const title = `${SITE_TITLE} is ready to go!`;

  // render the template
  App.render(mainmenuTemplate({ title }));
  if (ls.getItem('theme') === 'good') {
    document.body.style.backgroundColor = '#4485c7';
    document.getElementById('theme').style.backgroundColor = '#b92234';
  } else {
    document.body.style.backgroundColor = '#b92234';
    document.getElementById('theme').style.backgroundColor = '#4485c7';
  }

  document.getElementById('theme').addEventListener('click', () => {
    if (ls.getItem('theme') === 'bad') {
      document.body.style.backgroundImage = "url('../assets/images/goodbg.png')";
      document.body.style.backgroundColor = '#4485c7';
      document.getElementById('theme').style.backgroundColor = '#b92234';
      ls.setItem('theme', 'good');
    } else {
      document.body.style.backgroundImage = "url('../assets/images/badbg.png')";
      document.body.style.backgroundColor = '#b92234';
      document.getElementById('theme').style.backgroundColor = '#4485c7';
      ls.setItem('theme', 'bad');
    }
  });

  if (ls.getItem('theme') === 'bad') {
    document.body.style.backgroundImage = "url('../assets/images/badbg.png')";
    document.body.style.backgroundSize = '100vw 100vh';
  } else {
    document.body.style.backgroundImage = "url('../assets/images/goodbg.png')";
    document.body.style.backgroundSize = '100vw 100vh';
  }

  function logout() {
    App.firebase.getAuth().signOut();
  }

  document.getElementsByClassName('a-button_menu')[3].addEventListener('click', () => {
    logout();
  });

  App.firebase.getAuth().onAuthStateChanged((user) => {
    if (user) {
      const mail = App.firebase.getAuth().currentUser.email;
      const name = mail.substr(0, mail.indexOf('@'));
      console.log(name);
    }
  });
};
