export default class DataSeeder {
  constructor() {
    this.lon = 3.71667;
    this.lat = 51.05;
  }

  changeLocation() {
    let rnd1 = Math.floor(Math.random() * 11) - 5;
    let rnd2 = Math.floor(Math.random() * 11) - 5;
    rnd1 *= 0.000001;
    rnd2 *= 0.000001;
    this.lat += rnd1;
    this.lon += rnd2;

    console.log(`lat: ${this.lat} lon:${this.lon}`);
  }

  walk() {
    this.interval = setInterval(() => {
      this.changeLocation();
    }, 1000);
  }

  stop() {
    clearInterval(this.interval);
  }
}
