/* eslint-disable max-len */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
/* eslint-disable no-restricted-properties */
import { MAPBOX_API_KEY } from '../../consts';
import App from '../App';
import MapBox from './MapBox';
import DataSeeder from './Dataseeder';
import Storage from './LocalStorage';
import Notificator from './Notification';


class Game {
  static async normalGame() {
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

    let profiles = [];

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

    for (let i = 0; i < ls.getArray('GameSettings')[0]; i++) {
      const lat = 3.670823 + Math.sin((Math.PI * 2) * (i / ls.getArray('GameSettings')[0])) * 0.0008;
      const lon = 51.087544 + Math.cos((Math.PI * 2) * (i / ls.getArray('GameSettings')[0])) * 0.0008;

      if (i === 0) {
        dsArray.push(new DataSeeder(ls.getArray('GameSettings')[2], 'bad'));
        mapBox.addPic(dsArray[i].getPos().lat, dsArray[i].getPos().lon, profiles[i].name, 'bad');
      } else {
        dsArray.push(new DataSeeder(ls.getArray('GameSettings')[2], 'good', lat, lon));
        mapBox.addPic(dsArray[i].getPos().lat, dsArray[i].getPos().lon, profiles[i].name, 'good');
      }
    }

    const interval = setInterval(async () => {
    // tagged variabele om instant terugtikken te vermijden
      let tagged = false;
      for (let i = 0; i < ls.getArray('GameSettings')[0]; i++) {
      // tikken registreren
        if (dsArray[i].type === 'bad' && !tagged) {
          for (let j = 0; j < ls.getArray('GameSettings')[0]; j++) {
            if (dsArray[i].calcDistanceTo(dsArray[j].lat, dsArray[j].lon) < 0.0004
          && dsArray[i].calcDistanceTo(dsArray[j].lat, dsArray[j].lon) !== 0) {
              tagged = true;
              dsArray[i].type = 'good';
              dsArray[j].type = 'bad';
              this.showTagged(profiles[j].name);
              mapBox.map.removeLayer(profiles[i].name);
              mapBox.map.removeLayer(profiles[j].name);
              mapBox.map.removeSource(profiles[i].name);
              mapBox.map.removeSource(profiles[j].name);

              mapBox.updatePicBad(dsArray[j].getPos().lat, dsArray[j].getPos().lon, profiles[j].name);
              mapBox.updatePicGood(dsArray[i].getPos().lat, dsArray[i].getPos().lon, profiles[i].name);

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
          if (mapBox.map.getLayer(profiles[i].name)) {
            mapBox.map.removeLayer(profiles[i].name);
          }
          if (mapBox.map.getSource(profiles[i].name)) {
            mapBox.map.removeSource(profiles[i].name);
            if (dsArray[i].type === 'bad') {
              mapBox.updatePicBad(dsArray[i].getPos().lat, dsArray[i].getPos().lon, profiles[i].name);
            } else {
              mapBox.updatePicGood(dsArray[i].getPos().lat, dsArray[i].getPos().lon, profiles[i].name);
            }
          }
        }
      }
    }, 5000);


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
      let timeplayed;

      await App.firebase.getFirestore().collection('players').doc(userid).get()
        .then((doc) => {
          if (doc.exists) {
            timeplayed = doc.data().timeplayed;
            const totaltime = timeplayed + dsArray[0].timeplayed;
            const data = { timeplayed: totaltime, lobbycode: '' };
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

      let today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth() + 1; // January is 0!

      const yyyy = today.getFullYear();
      if (dd < 10) {
        dd = `0${dd}`;
      }
      if (mm < 10) {
        mm = `0${mm}`;
      }
      today = `${dd}/${mm}/${yyyy}`;
      await this.addToHistory('normal', profiles, dsArray[0].timeplayed, today);

      clearInterval(interval);
      clearInterval(interval2);
      App.router.navigate('/mainmenu');
    });
  }


  static async battleGame() {
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
      style: 'mapbox://styles/mapbox/outdoors-v11',
      zoom: 16,
      maxBounds: bounds,
    };

    const mapBox = new MapBox(MAPBOX_API_KEY, mapBoxOptions);


    const dsArray = [];

    let profiles = [];

    await App.firebase.getFirestore().collection('players').where('lobbycode', '==', ls.getItem('Code').toUpperCase()).get()
      .then((querySnapshot) => {
        profiles = [];
        querySnapshot.forEach((doc) => {
          profiles.push(doc.data());
        });
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });

    for (let i = 0; i < profiles.length; i++) {
      const lat = 3.670823 + Math.sin((Math.PI * 2) * (i / ls.getArray('GameSettings')[0])) * 0.0008;
      const lon = 51.087544 + Math.cos((Math.PI * 2) * (i / ls.getArray('GameSettings')[0])) * 0.0008;

      if (i < (profiles.length / 2)) {
        dsArray.push(new DataSeeder(ls.getArray('GameSettings')[2], 'bad'));
        mapBox.addPic(dsArray[i].getPos().lat, dsArray[i].getPos().lon, profiles[i].name, 'bad');
      } else {
        dsArray.push(new DataSeeder(ls.getArray('GameSettings')[2], 'good', lat, lon));
        mapBox.addPic(dsArray[i].getPos().lat, dsArray[i].getPos().lon, profiles[i].name, 'good');
	  }
    }

    let counter = 0;
    let turn = 'good';
    const interval = setInterval(async () => {
    // tagged variabele om instant terugtikken te vermijden
	  let tagged = false;
      for (let i = 0; i < profiles.length; i++) {
      // tikken registreren
        if (dsArray[i].type === turn && !tagged) {
          for (let j = 0; j < ls.getArray('GameSettings')[0]; j++) {
            if (dsArray[i].calcDistanceTo(dsArray[j].lat, dsArray[j].lon) < 0.0004
          && dsArray[i].calcDistanceTo(dsArray[j].lat, dsArray[j].lon) !== 0 && dsArray[i].type !== dsArray[j].type) {
              tagged = true;
			  dsArray[j].type = turn;
			  this.showTagged(profiles[j].name, turn, 'battle', profiles[i].name);

              mapBox.map.removeLayer(profiles[j].name);
              mapBox.map.removeSource(profiles[j].name);

			  if (turn === 'bad') {
                mapBox.updatePicBad(dsArray[j].getPos().lat, dsArray[j].getPos().lon, profiles[j].name);
              } else {
                mapBox.updatePicGood(dsArray[j].getPos().lat, dsArray[j].getPos().lon, profiles[j].name);
              }
            }
          }
        }

        // alle spelers laten bewegen
        dsArray[i].changeLocation();
        let pos0 = dsArray[i].getPos();
        if (dsArray[i].getPos() !== pos0) {
          pos0 = dsArray[i].getPos();
          if (mapBox.map.getLayer(profiles[i].name)) {
            mapBox.map.removeLayer(profiles[i].name);
          }
          if (mapBox.map.getSource(profiles[i].name)) {
            mapBox.map.removeSource(profiles[i].name);
            if (dsArray[i].type === 'bad') {
              mapBox.updatePicBad(dsArray[i].getPos().lat, dsArray[i].getPos().lon, profiles[i].name);
              if (turn === 'bad') {
                mapBox.map.setPaintProperty(profiles[i].name, 'text-color', '#FFFFFF');
              }
            } else {
              mapBox.updatePicGood(dsArray[i].getPos().lat, dsArray[i].getPos().lon, profiles[i].name);
              if (turn === 'bad') {
                mapBox.map.setPaintProperty(profiles[i].name, 'text-color', '#FFFFFF');
              }
            }
          }
        }
	  }
	  counter += 2;

	  if (counter === 60) {
        if (turn === 'bad') {
		  turn = 'good';
		  this.showTurnSwitch(turn, mapBox, profiles, dsArray);
        } else {
		  turn = 'bad';
		  this.showTurnSwitch(turn, mapBox, profiles, dsArray);
        }
        counter = 0;
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
      let timeplayed;

      await App.firebase.getFirestore().collection('players').doc(userid).get()
        .then((doc) => {
          if (doc.exists) {
            timeplayed = doc.data().timeplayed;
            const totaltime = timeplayed + dsArray[0].timeplayed;
            const data = { timeplayed: totaltime, lobbycode: '' };
            App.firebase.setStat(App.firebase.getAuth().currentUser.uid, data);
          }
        })
        .catch((err) => {
          console.log('Error getting document', err);
        });

      await App.firebase.getFirestore().collection('players').where('lobbycode', '==', ls.getItem('Code').toUpperCase()).get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            App.firebase.deleteOnUID(doc.id);
          });
        })
        .catch((error) => {
          console.log('Error getting documents: ', error);
        });
      let today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth() + 1; // January is 0!

      const yyyy = today.getFullYear();
      if (dd < 10) {
        dd = `0${dd}`;
      }
      if (mm < 10) {
        mm = `0${mm}`;
      }
      today = `${dd}/${mm}/${yyyy}`;

      await this.addToHistory('battle', profiles, dsArray[0].timeplayed, today);

      clearInterval(interval);
      clearInterval(interval2);
      App.router.navigate('/mainmenu');
    });
  }

  static showTagged(name, turn = '', mode = 'normal', name2 = '') {
	  if (mode === 'normal') {
	  Notificator.notification('TAG!', `${name} is now the tagger!`);
    } else {
      Notificator.notification('TAG!', `${name2} has made ${name} join the ${turn} side!`);
    }
  }

  static showTurnSwitch(turn, mapBox, profiles, dsArray) {
    Notificator.notification('TAG!', `The ${turn} side are now the taggers!`);
    if (turn === 'bad') {
      mapBox.map.setStyle('mapbox://styles/mapbox/dark-v10');
      document.getElementById('timer').style.color = '#FFFFFF';
    } else {
      mapBox.map.setStyle('mapbox://styles/mapbox/outdoors-v11');
      document.getElementById('timer').style.color = '#000000';
    }
    for (let i = 0; i < profiles.length; i++) {
      mapBox.addPic(dsArray[i].getPos().lat, dsArray[i].getPos().lon, profiles[i].name, dsArray[i].type);
    }
  }


  static async addToHistory(mode, profiles, time, datum) {
    const names = [];
    profiles.forEach((profile) => {
      names.push(profile.name);
    });
    const user = App.firebase.getAuth().currentUser.uid;
    const data = {
      user, gamemode: mode, players: names, timeplayed: time, date: datum, compare: Date.now(),
    };

    await App.firebase.setHistory(data);
  }
}

export default Game;
