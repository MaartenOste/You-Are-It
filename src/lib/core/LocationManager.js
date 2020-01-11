import LocalStorage from './LocalStorage';

class LocationManager {
  constructor() {
    this.coords = [];
  }

  getCurrentPosition() {
    return navigator.geolocation.getCurrentPosition(this.success, this.error);
  }

  success(pos) {
    const ls = new LocalStorage(localStorage);
    const crd = pos.coords;
    const coord = [crd.longitude, crd.latitude];
    ls.setItem('location', coord);
  }

  error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
}

export default LocationManager;
