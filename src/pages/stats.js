import App from '../lib/App';

const statsTemplate = require('../templates/stats.hbs');

export default () => {
  // check if internet connection
  App.firebase.checkConnection();

  // check if user
  App.firebase.checkUser();

  // render the template
  App.render(statsTemplate());

  App.firebase.getAuth().onAuthStateChanged(async (user) => {
    if (user) {
      const userid = App.firebase.getAuth().currentUser.uid;
      await App.firebase.getFirestore().collection('players').doc(userid).get()
        .then((doc) => {
          if (doc.exists) {
            document.getElementById('games').innerText = doc.data().games;
            let { timeplayed } = doc.data();


            // let timeplayed = parseInt(123456, 10);

            const days = Math.floor(timeplayed / (3600 * 24));
            timeplayed -= days * 3600 * 24;
            const hrs = Math.floor(timeplayed / 3600);
            timeplayed -= hrs * 3600;
            const mnts = Math.floor(timeplayed / 60);
            timeplayed -= mnts * 60;

            document.getElementById('timeplayed').innerText = `${days}d ${hrs}h ${mnts}m ${timeplayed}s`;
            document.getElementById('uname').innerText = doc.data().name;
            const img = document.createElement('img');
            if (App.firebase.getAuth().currentUser.photoURL) {
              img.src = App.firebase.getAuth().currentUser.photoURL;
              img.style.width = '10vw';
              img.style.borderRadius = '50%';
              document.getElementById('uicon').innerHTML = '';
              document.getElementById('uicon').appendChild(img);
            }
          }
        })
        .catch((err) => {
          console.log('Error getting document', err);
        });
    }
  });
};
