class DataSeeder {
  constructor(time) {
    this.lat = 3.670823;
    this.lon = 51.087544;
    this.changeLocation();
    this.timer(time);
    console.log('dataseeder ready');
  }

  changeLocation() {
    let rnd1 = Math.floor(Math.random() * 11) - 5;
    let rnd2 = Math.floor(Math.random() * 11) - 5;
    rnd1 *= 0.0002;
    rnd2 *= 0.0002;
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
    }, 1000);
  }

  getTime() {
    return this.time;
  }
}

export default DataSeeder;
