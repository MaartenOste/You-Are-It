/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
import App from '../lib/App';
import DataSeeder from '../lib/core/Dataseeder';
import LocalStorage from '../lib/core/LocalStorage';

const lobbyTemplate = require('../templates/lobby.hbs');

export default async () => {
  App.firebase.checkConnection();

  // check if user
  App.firebase.checkUser();

  // render the template
  App.render(lobbyTemplate());

  const ls = new LocalStorage(localStorage);
  const d = new DataSeeder();

  let NOPlayers;
  if (ls.getItem('UserType') === 'player') {
    NOPlayers = 4 + Math.floor(Math.random() * 6);
    ls.setArray('GameSettings', [NOPlayers, 'normal', 10, 5]);
  } else {
    NOPlayers = ls.getArray('GameSettings')[0] - 1;
  }
  let profiles = await d.randomPersons(NOPlayers);
  document.getElementById('code').innerHTML = `CODE: ${ls.getItem('Code').toUpperCase()}`;


  profiles.forEach((profile) => {
    App.firebase.addUser(profile, '', ls.getItem('Code').toUpperCase(), DataSeeder.randomUID());
  });


  await App.firebase.getFirestore().collection('players').where('lobbycode', '==', ls.getItem('Code').toUpperCase()).get()
    .then((querySnapshot) => {
      profiles = [];
      querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
        profiles.push(doc.data());
      });
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
    });

  profiles.forEach((profile) => {
    const div = document.createElement('div');
    div.className = 'm-setting';
    const div2 = document.createElement('div');
    div2.className = 'a-statlabel';
    div2.innerText = profile.name;
    div.appendChild(div2);
    document.getElementsByClassName('m-players')[0].appendChild(div);
  });

  document.body.style.backgroundImage = '';

  document.getElementsByClassName('a-title')[0].innerText = `${ls.getArray('GameSettings')[1]} mode`;

  document.getElementById('start').addEventListener('click', async () => {
    let data;
    const { uid } = App.firebase.getAuth().currentUser;
    await App.firebase.getFirestore().collection('players').doc(uid).get()
      .then((doc) => {
        if (!doc.exists) {
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

  document.getElementById('quit').addEventListener('click', async () => {
    const userid = App.firebase.getAuth().currentUser.uid;

    await App.firebase.getFirestore().collection('players').doc(userid).get()
      .then((doc) => {
        if (doc.exists) {
          const data = { lobbycode: '' };
          App.firebase.setStat(App.firebase.getAuth().currentUser.uid, data);
        }
      })
      .catch((err) => {
        console.log('Error getting document', err);
      });

    await App.firebase.getFirestore().collection('players').where('lobbycode', '==', ls.getItem('Code').toUpperCase()).get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          App.firebase.deleteOnUID(doc.id);
        });
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
  });
};
