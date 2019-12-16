/**
 * A MapBox wrapper
 * docs: https://docs.mapbox.com/mapbox-gl-js/api/
 *
 * @author Tim De Paepe <tim.depaepe@arteveldehs.be>
 */

import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import * as d3 from 'd3';

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

  addMarker(lat, lon, name) {
    this.map.on('load', () => {
      this.map.addLayer({
        id: name,
        type: 'symbol',
        fadeDuration: 0,
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
                properties: {
                  title: name,
                },
              },
            ],
          },
        },
        layout: {
          // get the icon name from the source's "icon" property
          // concatenate the name to get an icon from the style's sprite sheet
          'icon-image': ['concat', ['get', 'icon'], '-15'],
          // get the title name from the source's "title" property
          'text-field': ['get', 'title'],
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-offset': [0, 0.6],
          'text-anchor': 'top',
        },
      });
    });
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

  updateMarker(lat, lon, name) {
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
                coordinates: [
                  lat,
                  lon,
                ],
              },
              properties: {
                title: name,
              },
            },
          ],
        },
      },
      layout: {
        // get the icon name from the source's "icon" property
        // concatenate the name to get an icon from the style's sprite sheet
        'icon-image': ['concat', ['get', 'icon'], '-15'],
        // get the title name from the source's "title" property
        'text-field': ['get', 'title'],
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 0.6],
        'text-anchor': 'top',
      },
    });
  }

  autoRun() {
    this.map.on('load', () => {
      // We use D3 to fetch the JSON here so that we can parse and use it separately
      // from GL JS's use in the added source. You can use any request method (library
      // or otherwise) that you want.
      d3.json(
        'https://docs.mapbox.com/mapbox-gl-js/assets/hike.geojson',
        (err, data) => {
          if (err) throw err;

          // save full coordinate list for later
          const { coordinates } = data.features[0].geometry;

          // start by showing just the first coordinate
          // eslint-disable-next-line no-param-reassign
          data.features[0].geometry.coordinates = [coordinates[0]];

          // add it to the map
          this.map.addSource('trace', { type: 'geojson', data });
          this.map.addLayer({
            id: 'trace',
            type: 'line',
            source: 'trace',
            paint: {
              'line-color': 'yellow',
              'line-opacity': 0.75,
              'line-width': 5,
            },
          });

          // setup the viewport
          this.map.jumpTo({ center: coordinates[0], zoom: 14 });
          this.map.setPitch(30);

          // on a regular basis, add more coordinates from the saved list and update the map
          let i = 0;
          const timer = window.setInterval(() => {
            if (i < coordinates.length) {
              data.features[0].geometry.coordinates.push(
                coordinates[i],
              );
              this.map.getSource('trace').setData(data);
              this.map.panTo(coordinates[i]);
              i++;
            } else {
              window.clearInterval(timer);
            }
          }, 10);
        },
      );
    });
  }
}

export default MapBox;
