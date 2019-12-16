import { SITE_TITLE, MAPBOX_API_KEY } from '../consts';
import App from '../lib/App';
import MapBox from '../lib/core/MapBox';
import DataSeeder from '../lib/core/Dataseeder';

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

  const P = {
    latitude: 3.670823,
    longitude: 51.087544,
  };

  mapBox.addMarker(P.latitude + 1 * 0.005, P.longitude + 1 * 0.005, 'Player0');


  /* for (let i = 0; i < 6; i++) {
    mapBox.addMarker(P.latitude + i * 0.005, P.longitude + i * 0.005, `Player${i}`);
  } */
  const ds = new DataSeeder();

  // eslint-disable-next-line no-unused-vars
  const interval = setInterval(() => {
    ds.changeLocation();
    let pos0 = ds.getPos();
    if (ds.getPos() !== pos0) {
      pos0 = ds.getPos();
      if (mapBox.map.getLayer('Player0')) {
        mapBox.map.removeLayer('Player0');
      }
      if (mapBox.map.getSource('Player0')) {
        mapBox.map.removeSource('Player0');
        mapBox.updateMarker(ds.getPos().lat, ds.getPos().lon, 'Player0');
      }
    }
  }, 500);


  document.getElementById('menubutton').addEventListener('click', () => {
    clearInterval(interval);
  });
};
