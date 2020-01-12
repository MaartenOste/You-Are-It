/* eslint-disable no-unused-vars */
import { SITE_TITLE, MAPBOX_API_KEY } from '../consts';
import App from '../lib/App';
import MapBox from '../lib/core/MapBox';
import DataSeeder from '../lib/core/Dataseeder';
import Storage from '../lib/core/LocalStorage';

const gameTemplate = require('../templates/game.hbs');

export default async () => {
  const title = `${SITE_TITLE} is ready to go!`;

  App.render(gameTemplate({ title }));

  const ls = new Storage(localStorage);

  const minLon = 51.087544 - (ls.getArray('GameSettings')[3] / 110.574) / 2;
  const maxLon = 51.087544 + (ls.getArray('GameSettings')[3] / 110.574) / 2;
  const minLat = 3.670823 - (ls.getArray('GameSettings')[3] / (111.320 * Math.cos(51.087544 * (Math.PI / 180)))) / 2;
  const maxlat = 3.670823 + (ls.getArray('GameSettings')[3] / (111.320 * Math.cos(51.087544 * (Math.PI / 180)))) / 2;

  const bounds = [
    [minLat, minLon], // SW coord
    [maxlat, maxLon], // NE coord
  ];

  const mapBoxOptions = {
    container: 'mapbox',
    center: [3.670823, 51.087544],
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 16,
    maxBounds: bounds,
  };

  const mapBox = new MapBox(MAPBOX_API_KEY, mapBoxOptions);

  const dsArray = [];

  for (let i = 0; i < ls.getArray('GameSettings')[0]; i++) {
    const lat = 3.670823 + Math.sin((Math.PI * 2) * (i / ls.getArray('GameSettings')[0])) * 0.0008;
    const lon = 51.087544 + Math.cos((Math.PI * 2) * (i / ls.getArray('GameSettings')[0])) * 0.0008;

    if (i === 0) {
      dsArray.push(new DataSeeder(ls.getArray('GameSettings')[2], 'bad'));
      mapBox.addPic(dsArray[i].getPos().lat, dsArray[i].getPos().lon, `Player${i}`, 'bad');
    } else {
      dsArray.push(new DataSeeder(ls.getArray('GameSettings')[2], 'good', lat, lon));
      mapBox.addPic(dsArray[i].getPos().lat, dsArray[i].getPos().lon, `Player${i}`, 'good');
    }
  }

  const interval = setInterval(async () => {
    for (let i = 0; i < ls.getArray('GameSettings')[0]; i++) {
      // tikken registreren
      if (dsArray[i].type === 'bad') {
        for (let j = 0; j < ls.getArray('GameSettings')[0]; j++) {
          if (dsArray[i].calcDistanceTo(dsArray[j].lat, dsArray[j].lon) < 0.0003
          && dsArray[i].calcDistanceTo(dsArray[j].lat, dsArray[j].lon) !== 0) {
            console.log(dsArray[i].calcDistanceTo(dsArray[j].lat, dsArray[j].lon));
            dsArray[i].type = 'good';
            // eslint-disable-next-line no-param-reassign
            dsArray[j].type = 'bad';
            console.log('ticked');
            console.log(`tikekr is nu: player${j}`);

            mapBox.map.removeLayer(`Player${i}`);
            mapBox.map.removeLayer(`Player${j}`);
            mapBox.map.removeSource(`Player${i}`);
            mapBox.map.removeSource(`Player${j}`);

            mapBox.updatePicBad(dsArray[j].getPos().lat, dsArray[j].getPos().lon, `Player${j}`);
            mapBox.updatePicGood(dsArray[i].getPos().lat, dsArray[i].getPos().lon, `Player${i}`);

            // break nodig om meerdere personen tegelijk te tikken te vermijden
            break;
          }
        }
      }

      // alle spelers laten bewegen
      dsArray[i].changeLocation();
      let pos0 = dsArray[i].getPos();
      if (dsArray[i].getPos() !== pos0) {
        pos0 = dsArray[i].getPos();
        if (mapBox.map.getLayer(`Player${i}`)) {
          mapBox.map.removeLayer(`Player${i}`);
        }
        if (mapBox.map.getSource(`Player${i}`)) {
          mapBox.map.removeSource(`Player${i}`);
          if (dsArray[i].type === 'bad') {
            mapBox.updatePicBad(dsArray[i].getPos().lat, dsArray[i].getPos().lon, `Player${i}`);
          } else {
            mapBox.updatePicGood(dsArray[i].getPos().lat, dsArray[i].getPos().lon, `Player${i}`);
          }
        }
      }
    }
  }, 2000);


  const interval2 = setInterval(() => {
    document.getElementById('timer').innerText = dsArray[0].time;
    if (dsArray[0].time === '00:00') {
      clearInterval(interval);
      clearInterval(interval2);
    }
  }, 1000);

  document.getElementById('menubutton').addEventListener('click', () => {
    if (document.getElementById('gamemenu').style.display === 'block') {
      document.getElementById('gamemenu').style.display = 'none';
    } else {
      document.getElementById('gamemenu').style.display = 'block';
    }
    if (ls.getItem('theme') === 'bad') {
      document.getElementById('gamemenu').style.backgroundColor = '#b92234';
    } else {
      document.getElementById('gamemenu').style.backgroundColor = '#4485c7';
    }
  });

  document.getElementById('leave').addEventListener('click', () => {
    document.getElementById('leave').style.display = 'none';
    document.getElementById('confirm').style.display = 'block';
  });

  document.getElementById('decline').addEventListener('click', () => {
    document.getElementById('leave').style.display = 'block';
    document.getElementById('confirm').style.display = 'none';
  });

  document.getElementById('confirm2').addEventListener('click', async () => {
    const userid = App.firebase.getAuth().currentUser.uid;

    await App.firebase.getFirestore().collection('players').doc(userid).get()
      .then((doc) => {
        if (doc.exists) {
          const { timeplayed } = doc.data();
          const totaltime = timeplayed + dsArray[0].timeplayed;
          const data = { timeplayed: totaltime };
          App.firebase.setStat(App.firebase.getAuth().currentUser.uid, data);
        }
      })
      .catch((err) => {
        console.log('Error getting document', err);
      });
    clearInterval(interval);
    clearInterval(interval2);
    App.router.navigate('mainmenu');
  });
};
