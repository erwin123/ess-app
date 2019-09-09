import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import { Draw } from 'ol/interaction';
import Overlay from 'ol/Overlay';
import { ScaleLine, Zoom, Rotate } from 'ol/control';
import { Point } from 'ol/geom';
import { Circle as circularPolygon } from 'ol/geom';
import Feature from 'ol/Feature';
import TileLayer from 'ol/layer/Tile';

import LayerVector from 'ol/layer/Vector';
import { fromLonLat, transform, METERS_PER_UNIT } from 'ol/proj';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import SourceVector from 'ol/source/Vector';
import View from 'ol/View';
import { Circle as Circle, Fill, Icon, Stroke, Style } from 'ol/style';
import * as Geocoder from 'ol-geocoder';

@Component({
  selector: 'app-set-location',
  templateUrl: './set-location.component.html',
  styleUrls: ['./set-location.component.scss']
})
export class SetLocationComponent implements OnInit {

  headOffice = [106.8201155, -6.1697791];
  pickedLonLat = [0, 0];
  map: any;
  draw: any;
  ol: any;
  styles = {
    'geoMarker': new Style({
      image: new Circle({
        radius: 5,
        fill: new Fill({ color: 'rgb(50, 88, 184, 0.9)' }),
        stroke: new Stroke({
          color: '#ffffff', width: 1
        })
      })
    })
  };
  constructor() { }

  ngOnInit() {
    this.map = new Map({
      target: 'map',
      projection: 'EPSG:4326',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat(this.headOffice),
        zoom: 8,
        maxZoom: 17
      }),
      controls: [new Zoom, this.setupSearch()]
    });

    // this.map.on('singleclick', (event) => {
    //   this.setCoordinate(event.coordinate, 0);
    // });

    let source = new SourceVector({ wrapX: false });
    this.setupDraw(source);
    this.map.addLayer(this.setupLayer(source));
    this.map.addInteraction(this.draw);

    //clear previous first
    this.draw.on('drawstart', (e) => {
      source.getFeatures().forEach(el => {
        source.removeFeature(el, true);
      });
      this.map.getLayers().forEach(el => {
        try {
          if (el.constructor.name === "VectorLayer") {
            let features = el.getSource().getFeatures();
            if (features.length > 0) {
              this.map.removeLayer(el);
            }
          }
        } catch (e) {

        }
      });
    })

    this.draw.on('drawend', (e) => {
      let circleFeature = e.feature.getGeometry();
      let units = this.map.getView().getProjection().getUnits();
      let center = circleFeature.getCenter();
      let radius = circleFeature.getRadius();
      this.pickedLonLat = transform(center, 'EPSG:3857', 'EPSG:4326');
      console.log("POINT: " + transform(center, 'EPSG:3857', 'EPSG:4326'));
      console.log("RADIUS: " + radius * METERS_PER_UNIT[units]);
      this.addPoint(this.pickedLonLat);
      //this.addRadius(this.pickedLonLat,radius)
    });
    //this.map.addControl(this.setupSearch());
  }

  setLocation() {
    this.map.getLayers().forEach(el => {
      try {

        if (el.constructor.name === "VectorLayer") {
          let features = el.getSource().getFeatures();
          if (features.length == 0) {
            alert("draw circle first !");
            return;
          }
          let circleFeature = features[0].getGeometry();
          let units = this.map.getView().getProjection().getUnits();
          let center = circleFeature.getCenter();
          let radius = circleFeature.getRadius();
          console.log("POINT: " + transform(center, 'EPSG:3857', 'EPSG:4326'));
          console.log("RADIUS: " + radius * METERS_PER_UNIT[units]);
          console.log(transform(circleFeature.getFirstCoordinate(), 'EPSG:3857', 'EPSG:4326'));
          console.log(transform(circleFeature.getLastCoordinate(), 'EPSG:3857', 'EPSG:4326'));
          let first = transform(circleFeature.getFirstCoordinate(), 'EPSG:3857', 'EPSG:4326');
          let last = transform(circleFeature.getLastCoordinate(), 'EPSG:3857', 'EPSG:4326');
          this.getDistance(first[0], first[1], last[0], last[1]);

        }
      } catch (e) {
        return;
      }
    });

  }

  deg2rad(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
  }

  getDistance(lon1, lat1, lon2, lat2) {
    let earth_radius = 6371;

    let dLat = this.deg2rad(lat2 - lat1);
    let dLon = this.deg2rad(lon2 - lon1);

    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.asin(Math.sqrt(a));
    let d = earth_radius * c;

  }
  setupSearch() {
    let geocoder = new Geocoder('nominatim', {
      provider: 'osm',
      lang: 'en',
      placeholder: 'Search for ...',
      limit: 5,
      debug: false,
      autoComplete: true,
      keepOpen: false,
      preventDefault: true
    })
    geocoder.on('addresschosen', (evt) => {
      //this.setCoordinate(evt.coordinate, 0);
      let view = this.map.getView();
      view.setCenter(fromLonLat(transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326')));
      view.setZoom(16);
    });
    return geocoder;
  }

  setupDraw(source) {
    let geometryFunction, maxPoints;
    this.draw = new Draw({
      source: source,
      type: ("Circle"),
      geometryFunction: geometryFunction,
      maxPoints: maxPoints
    });
  }

  setupLayer(source) {
    return new LayerVector({
      source: source,
      style: new Style({
        fill: new Fill({
          color: 'rgba(50, 88, 184, 0.3)'
        }),
        stroke: new Stroke({
          color: 'rgba(50, 88, 184, 0.5)',
          width: 2
        }),
        image: new Circle({
          radius: 7,
          fill: new Fill({
            color: '#3258b8'
          })
        })
      })
    });
  }

  addPoint(lonlat) {
    let geoMarker = new Feature({
      type: 'geoMarker',
      geometry: new Point(fromLonLat(lonlat))
    });
    let layer = new LayerVector({
      source: new SourceVector({
        features: [geoMarker]
      }),
      style: this.styles['geoMarker']
    });
    this.map.addLayer(layer);
  }

  addRadius(lonlat, radius) {
    let circle4326 = new circularPolygon(fromLonLat(lonlat), radius);
    //let view = this.map.getView();
    //view.setCenter(fromLonLat(lonlat));

    let layer = new LayerVector({
      source: new SourceVector({
        features: [new Feature({
          geometry: circle4326
        })]
      }),
      style: [new Style({
        stroke: new Stroke({
          color: 'blue',
          width: 3
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)'
        })
      })]
    });
    this.map.addLayer(layer);
  }

  setHeadOffice(lonlat) {
    var view = this.map.getView();
    view.setCenter(fromLonLat(lonlat));
    view.setZoom(16);

    // if (isHO) {
    //   geoMarker = new Feature({
    //     type: 'geoMarker',
    //     geometry: new Point(fromLonLat(lonlat))
    //   });
    //   view.setCenter(fromLonLat(lonlat));
    //   view.setZoom(16);
    // } else {
    //   geoMarker = new Feature({
    //     type: 'geoMarker',
    //     geometry: new Point(fromLonLat(transform(lonlat, 'EPSG:3857', 'EPSG:4326')))
    //   });
    // }

    // let layer = new LayerVector({
    //   source: new SourceVector({
    //     features: [geoMarker]
    //   }),
    //   style: this.styles['geoMarker']
    // });
    //this.map.addLayer(layer);
    //this.pickedLonLat = lonlat;
    // setTimeout(() => {
    //   this.map.getLayers().array_[1].getStyle().setImage(new Circle({
    //     radius: 9,
    //     fill: new Fill({ color: '#ffcc00' }),
    //     stroke: new Stroke({
    //       color: '#ffffff', width: 1
    //     })
    //   }))
    // }, 1000);
    //var circle4326 = new circularPolygon(fromLonLat(this.headOffice), 1000);
    // var view = this.map.getView();
    // view.setCenter(fromLonLat(lonlat));
    // //view.setZoom(8);
    // let geoMarker = new Feature({
    //   type: 'geoMarker',
    //   geometry: new Point(fromLonLat(lonlat))
    // });
    // let layer = new LayerVector({
    //   source: new SourceVector({
    //     features: [new Feature({
    //       geometry: circle4326
    //     })]
    //   }),
    //   style: [new Style({
    //     stroke: new Stroke({
    //       color: 'blue',
    //       width: 3
    //     }),
    //     fill: new Fill({
    //       color: 'rgba(0, 0, 255, 0.1)'
    //     })
    //   })]
    // });
    // this.map.addLayer(layer);
  }

  clearDraw() {
    this.map.getLayers().forEach(el => {
      if (el.constructor.name === "VectorLayer") {
        let features = el.getSource().getFeatures();
        features.forEach(el2 => {
          el.getSource().removeFeature(el2, true);
        });
        if (features.length == 0) {
          alert("draw circle first !");
          return;
        }
      }
    })
    this.pickedLonLat = [0, 0];
    // this.map.getLayers().forEach((e, i) => {
    //   if (i > 0) {
    //     this.map.removeLayer(e);
    //   }
    // });
    // this.map.getInteractions().forEach((e, i) => {
    //   if (e.constructor.name === "Draw") {
    //     this.map.removeInteraction(e);
    //   }
    // });
    // setTimeout(() => {
    //   let source = new SourceVector({ wrapX: false });
    //   this.setupDraw(source);
    //   this.map.addLayer(this.setupLayer(source));
    //   this.map.addInteraction(this.draw);
    // }, 600);
    // this.pickedLonLat = [0,0];
  }

}
