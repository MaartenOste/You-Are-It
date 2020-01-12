/* eslint-disable no-restricted-properties */
class DataSeeder {
  constructor(time = '10:00', type, lat = 3.670823, lon = 51.087544) {
    this.lat = lat;
    this.lon = lon;
    this.changeLocation();
    this.timer(time);
    this.timeplayed = 0;
    this.type = type;
  }

  static randomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }

  async randomPersons(amount = 5) {
    const persons = [];
    let temp = [];
    try {
      const data = await fetch(`https://randomuser.me/api/?results=${amount}`);
      const profielen = await data.json();

      temp = profielen.results;
    } catch (e) {
      throw new Error(e.message);
    }
    temp.forEach((person) => {
      persons.push(`${person.name.first} ${person.name.last}`);
    });
    return persons;
  }

  changeLocation() {
    const rnd3 = Math.random() * Math.PI * 2;
    let rnd1 = Math.sin(rnd3);
    let rnd2 = Math.cos(rnd3);
    rnd1 *= Math.random() * 0.0005;
    rnd2 *= Math.random() * 0.0005;
    this.lat += rnd1;
    this.lon += rnd2;
  }

  getPos() {
    const P = {
      lat: this.lat,
      lon: this.lon,
    };
    return P;
  }

  timer(duration) {
    let timer = duration * 60;
    let minutes;
    let seconds;
    setInterval(() => {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      if (--timer < 0) {
        timer = duration;
      }
      this.time = `${minutes}:${seconds}`;
      this.timeplayed++;
    }, 1000);
  }

  getTime() {
    return this.time;
  }

  calcDistanceTo(lat, lon) {
    return Math.sqrt(Math.pow(this.lat - lat, 2) + Math.pow(this.lon - lon, 2));
  }
}

export default DataSeeder;
