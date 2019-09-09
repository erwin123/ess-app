import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import { ScaleLine, Zoom, Rotate } from 'ol/control';
import { Point } from 'ol/geom';
import Feature from 'ol/Feature';
import TileLayer from 'ol/layer/Tile';

import LayerVector from 'ol/layer/Vector';
import { fromLonLat, transform } from 'ol/proj';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import SourceVector from 'ol/source/Vector';
import View from 'ol/View';
import { Circle as CircleStyle, Fill, Icon, Stroke, Style } from 'ol/style';
import * as Geocoder from 'ol-geocoder';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})


export class LandingComponent implements OnInit {
  latitude: number = -6.1697791;
  longitude: number = 106.8201155;

  pickedLonLat = [0,0];
  map: any;
  ol: any;
  styles = {
    'geoMarker': new Style({
      image: new CircleStyle({
        radius: 10,
        fill: new Fill({ color: '#203072' }),
        stroke: new Stroke({
          color: '#0d1742', width: 2
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
        center: fromLonLat([this.longitude, this.latitude]),
        zoom: 8
      }),
      controls: [new Zoom]
    });
    this.map.on('singleclick', (event) => {
      this.setByClick(event.coordinate);
    });

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
      this.setByClick(evt.coordinate);
      let view = this.map.getView();
      view.setCenter(fromLonLat(transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326')));
      view.setZoom(16);
    });
    this.map.addControl(geocoder);
  }

  setLocation(){
    console.log(this.map.getLayers());
  }

  setByClick(lonlat) {
    this.map.getLayers().forEach((el, i) => {
      if (i > 0) {
        this.map.removeLayer(el);
      }
    });

    let geoMarker = new Feature({
      type: 'geoMarker',
      geometry: new Point(fromLonLat(transform(lonlat, 'EPSG:3857', 'EPSG:4326')))
    });

    let layer = new LayerVector({
      source: new SourceVector({
        features: [geoMarker]
      }),
      style: this.styles['geoMarker']
    });
    this.map.addLayer(layer);
  }

  setCenter() {
    this.map.getLayers().forEach((el, i) => {
      if (i > 0) {
        this.map.removeLayer(el);
      }
    });
    let geoMarker = new Feature({
      type: 'geoMarker',
      geometry: new Point(fromLonLat([this.longitude, this.latitude]))
    });
    let layer = new LayerVector({
      source: new SourceVector({
        features: [geoMarker]
      }),
      style: this.styles['geoMarker']
    });
    this.map.addLayer(layer);
    var view = this.map.getView();
    view.setCenter(fromLonLat([this.longitude, this.latitude]));
    view.setZoom(16);
  }
}
