class DataSeeder {
  constructor() {
    this.lat = 3.670823;
    this.lon = 51.087544;
    console.log('dataseeder ready');
  }

  changeLocation() {
    let rnd1 = Math.floor(Math.random() * 11) - 5;
    let rnd2 = Math.floor(Math.random() * 11) - 5;
    rnd1 *= 0.0001;
    rnd2 *= 0.0001;
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

  getPos() {
    const P = {
      lat: this.lat,
      lon: this.lon,
    };
    return P;
  }
}

export default DataSeeder;
