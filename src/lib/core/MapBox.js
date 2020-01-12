/**
 * A MapBox wrapper
 * docs: https://docs.mapbox.com/mapbox-gl-js/api/
 *
 * @author Tim De Paepe <tim.depaepe@arteveldehs.be>
 */

import mapboxgl from 'mapbox-gl/dist/mapbox-gl';

class MapBox {
  constructor(apiKey, options = {}) {
    // set the apiKey & accessToken
    this.apiKey = apiKey;
    mapboxgl.accessToken = this.apiKey;

    // set the options (in case nothing was added, get the defaultOptions)
    this.options = Object.keys(options).length === 0 ? this.getDefaultOptions() : options;

    // create a new mapbox instance
    this.map = new mapboxgl.Map(this.options);
  }

  getDefaultOptions() {
    return {
      container: 'mapbox',
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 13,
    };
  }

  getMap() {
    return this.map;
  }

  addRadius(lat, lon) {
    this.map.on('load', () => {
      this.map.addLayer({
        id: 'points',
        type: 'cirle',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [
                    lat,
                    lon,
                  ],
                },
              },
            ],
          },
        },
      });
    });
  }

  addPic(lat, lon, name, type) {
    this.map.on('load', () => {
      this.map.loadImage(
        `../assets/images/${type}emoji.png`,
        (error, image) => {
          if (error) throw error;
          if (!this.map.hasImage(type)) {
            this.map.addImage(type, image);
          }
          this.map.addLayer({
            id: name,
            type: 'symbol',
            source: {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: [lat, lon],
                    },
                  },
                ],
              },
            },
            layout: {
              'icon-image': type,
              'icon-size': 0.07,
              'text-field': name,
              'symbol-placement': 'point',
              'text-anchor': 'bottom',
              'text-offset': [0, -1],
              'text-allow-overlap': true,
              'icon-allow-overlap': true,
            },
          });
        },
      );
    });
  }

  updatePicGood(lat, lon, name) {
    this.map.addLayer({
      id: name,
      type: 'symbol',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [lat, lon],
              },
            },
          ],
        },
      },
      layout: {
        'icon-image': 'good',
        'icon-size': 0.07,
        'text-field': name,
        'symbol-placement': 'point',
        'text-anchor': 'bottom',
        'text-offset': [0, -1],
        'text-allow-overlap': true,
        'icon-allow-overlap': true,
      },
    });
  }

  updatePicBad(lat, lon, name) {
    this.map.addLayer({
      id: name,
      type: 'symbol',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [lat, lon],
              },
            },
          ],
        },
      },
      layout: {
        'icon-image': 'bad',
        'icon-size': 0.07,
        'text-field': name,
        'symbol-placement': 'point',
        'text-anchor': 'bottom',
        'text-offset': [0, -1],
        'text-allow-overlap': true,
        'icon-allow-overlap': true,
      },
    });
  }
}

export default MapBox;
