/* eslint-disable no-alert */
import App from '../lib/App';
import LocalStorage from '../lib/core/LocalStorage';

const loginTemplate = require('../templates/login.hbs');

export default () => {
  // check if internet connection
  App.firebase.checkConnection();
  // render the template
  App.render(loginTemplate());
  const ls = new LocalStorage(localStorage);
  if (ls.getItem('theme') === 'undefined' || ls.getItem('theme') === 'bad') {
    const badcolor = 'rgb(185, 34, 52)';

    document.body.style.backgroundImage = "url('../assets/images/badbg.png')";
    document.body.style.backgroundSize = '100vw 100vh';
    document.body.style.backgroundColor = badcolor;
  } else {
    const goodcolor = '#4485c7';
    document.body.style.backgroundImage = "url('../assets/images/goodbg.png')";
    document.body.style.backgroundSize = '100vw 100vh';
    document.body.style.backgroundRepeat = 'no-repeat';

    document.body.style.backgroundColor = goodcolor;
  }

  function loginEmail() {
    const email = document.getElementById('emailfield').value;
    const pw = document.getElementById('pwfield').value;


    App.firebase.getAuth().signInWithEmailAndPassword(email, pw).catch((error) => {
      // eslint-disable-next-line no-unused-vars
      const errorCode = error.code;
      const errorMessage = error.message;
      window.alert(`Error: ${errorMessage}`);
      App.router.navigate('/login');
    });
  }

  function loginGoogle() {
    const provider = App.firebase.getGoogle();
    App.firebase.getAuth().signInWithPopup(provider).then(() => {
      App.router.navigate('/mainmenu');
    }).catch((err) => {
      console.log(err);
      console.log('failed to login with google');
    });
  }

  App.firebase.getAuth().onAuthStateChanged((user) => {
    if (user) {
      App.router.navigate('/mainmenu');
    }
  });

  document.getElementsByClassName('a-button_menu')[0].addEventListener('click', () => {
    loginEmail();
  });

  document.getElementById('google').addEventListener('click', () => {
    loginGoogle();
  });
};
