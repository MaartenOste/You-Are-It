
import { SITE_TITLE } from '../consts';
import App from '../lib/App';
import LocalStorage from '../lib/core/LocalStorage';
import LocationManager from '../lib/core/LocationManager';

const mainmenuTemplate = require('../templates/mainmenu.hbs');

export default () => {
  const ls = new LocalStorage(localStorage);
  // eslint-disable-next-line no-unused-vars
  const lm = new LocationManager();
  lm.getCurrentPosition();
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

  App.firebase.getAuth().onAuthStateChanged(async (user) => {
    if (user) {
      const userid = App.firebase.getAuth().currentUser.uid;
      let name = App.firebase.getAuth().currentUser.displayName;

      if (name == null) {
        const { email } = App.firebase.getAuth().currentUser;
        name = email.substring(0, email.lastIndexOf('@'));
      }
      lm.getCurrentPosition();
      await App.firebase.getFirestore().collection('players').doc(userid).get()
        .then((doc) => {
          if (!doc.exists) {
            App.firebase.addUser(name, ls.getItem('location'), '', userid);
          }
        })
        .catch((err) => {
          console.log('Error getting document', err);
        });
    }
  });
};
