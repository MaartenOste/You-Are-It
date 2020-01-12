/* eslint-disable max-len */
import { SITE_TITLE } from '../consts';
import App from '../lib/App';
import DataSeeder from '../lib/core/Dataseeder';
import LocalStorage from '../lib/core/LocalStorage';

const lobbyTemplate = require('../templates/lobby.hbs');

export default async () => {
  // set the title of this page
  const title = `${SITE_TITLE} is ready to go!`;

  // render the template
  App.render(lobbyTemplate({ title }));

  const ls = new LocalStorage(localStorage);
  const d = new DataSeeder();

  if (ls.getItem('UserType') === 'player') {
    ls.setArray('GameSettings', [5 + Math.floor(Math.random() * 5), 'normal', 10, 5]);
  }

  document.getElementById('code').innerHTML = `CODE: ${ls.getItem('Code').toUpperCase()}`;


  const profiles = await d.randomPersons(ls.getArray('GameSettings')[0] - 1);

  /* // real players:
  await App.firebase.getFirestore().collection('players').where('lobbycode', '==', ls.getItem('Code').toUpperCase()).get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, ' => ', doc.data());
      });
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
    });


  App.firebase.getAuth().onAuthStateChanged((user) => {
    if (user) {
      const mail = App.firebase.getAuth().currentUser.email;
      const name = mail.substr(0, mail.indexOf('@'));
      console.log(name);
    }
  });
  */

  profiles.forEach((name) => {
    const div = document.createElement('div');
    div.className = 'm-setting';
    const div2 = document.createElement('div');
    div2.className = 'a-statlabel';
    div2.innerText = name;
    div.appendChild(div2);
    document.getElementsByClassName('m-players')[0].appendChild(div);
  });

  const div = document.createElement('div');
  div.className = 'm-setting';
  const div2 = document.createElement('div');
  div2.className = 'a-statlabel';
  div2.innerText = 'you';
  div.appendChild(div2);
  document.getElementsByClassName('m-players')[0].insertBefore(div, document.getElementsByClassName('m-players')[0].firstChild);

  document.body.style.backgroundImage = '';

  document.getElementsByClassName('a-title')[0].innerText = `${ls.getArray('GameSettings')[1]} mode`;

  document.getElementById('start').addEventListener('click', async () => {
    let data = 'yeet';
    const { uid } = App.firebase.getAuth().currentUser;
    await App.firebase.getFirestore().collection('players').doc(uid).get()
      .then((doc) => {
        if (!doc.exists) {
          console.log('No such document!');
          data = { games: 1 };
        } else {
          data = { games: doc.data().games + 1 };
        }
      })
      .catch((err) => {
        console.log('Error getting document', err);
      });
    App.firebase.setStat(uid, data);
  });
};
