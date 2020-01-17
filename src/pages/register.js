/* eslint-disable no-alert */
/**
 * The Home Page
 */

import { SITE_TITLE } from '../consts';
import App from '../lib/App';

const registerTemplate = require('../templates/register.hbs');

export default () => {
  App.firebase.checkConnection();

  // set the title of this page
  const title = `${SITE_TITLE} is ready to go!`;

  // render the template
  App.render(registerTemplate({ title }));

  function signup() {
    const email = document.getElementById('emailfield').value;
    const pw = document.getElementById('pwfield').value;
    const pw1 = document.getElementById('pwfield1').value;

    if (pw === pw1) {
      App.firebase.getAuth().createUserWithEmailAndPassword(email, pw).catch((error) => {
        // eslint-disable-next-line no-unused-vars
        const errorCode = error.code;
        const errorMessage = error.message;
        window.alert(`Error: ${errorMessage}`);
        App.router.navigate('/register');
        document.getElementById('emailfield').value = '';
        document.getElementById('pwfield').value = '';
        document.getElementById('pwfield1').value = '';
      });
    } else {
      window.alert('The two given passwords are not identical.');
      App.router.navigate('/register');
      document.getElementById('pwfield').value = '';
      document.getElementById('pwfield1').value = '';
    }
  }


  document.getElementsByClassName('a-button_menu')[0].addEventListener('click', () => {
    signup();
  });
};
