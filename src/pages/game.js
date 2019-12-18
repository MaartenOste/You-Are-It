import { SITE_TITLE, MAPBOX_API_KEY } from '../consts';
import App from '../lib/App';
import MapBox from '../lib/core/MapBox';
import DataSeeder from '../lib/core/Dataseeder';
import Storage from '../lib/core/LocalStorage';

const homeTemplate = require('../templates/game.hbs');

export default () => {
  const title = `${SITE_TITLE} is ready to go!`;

  App.render(homeTemplate({ title }));

  const mapBoxOptions = {
    container: 'mapbox',
    center: [3.670823, 51.087544],
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 14,
  };
  const mapBox = new MapBox(MAPBOX_API_KEY, mapBoxOptions);
  const ls = new Storage(localStorage);


  const P = {
    latitude: 3.670823,
    longitude: 51.087544,
  };


  const dsArray = [];
  for (let i = 0; i < ls.getArray('GameSettings')[0]; i++) {
    dsArray.push(new DataSeeder(ls.getArray('GameSettings')[2]));
    mapBox.addMarker(P.latitude + i * 0.005, P.longitude + i * 0.005, `Player${i}`);
  }

  const interval = setInterval(() => {
    for (let i = 0; i < ls.getArray('GameSettings')[0]; i++) {
      dsArray[i].changeLocation();
      let pos0 = dsArray[i].getPos();
      if (dsArray[i].getPos() !== pos0) {
        pos0 = dsArray[i].getPos();
        if (mapBox.map.getLayer(`Player${i}`)) {
          mapBox.map.removeLayer(`Player${i}`);
        }
        if (mapBox.map.getSource(`Player${i}`)) {
          mapBox.map.removeSource(`Player${i}`);
          mapBox.updateMarker(dsArray[i].getPos().lat, dsArray[i].getPos().lon, `Player${i}`);
        }
      }
    }
  }, 2000);


  const interval2 = setInterval(() => {
    document.getElementById('timer').innerText = dsArray[0].time;
    if (dsArray[0].time === '00:00') {
      clearInterval(interval2);
    }
  }, 1000);

  document.getElementById('menubutton').addEventListener('click', () => {
    clearInterval(interval);
    clearInterval(interval2);
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
};
