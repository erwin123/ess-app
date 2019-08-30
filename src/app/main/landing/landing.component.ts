import { Component, OnInit, AfterViewInit } from '@angular/core';
import Map from 'ol/Map';
import { Point } from 'ol/geom';
import Feature from 'ol/Feature';
import TileLayer from 'ol/layer/Tile';

import LayerVector from 'ol/layer/Vector';
import { fromLonLat,transform } from 'ol/proj';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import SourceVector from 'ol/source/Vector';
import View from 'ol/View';
import { Circle as CircleStyle, Fill, Icon, Stroke, Style } from 'ol/style';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})


export class LandingComponent implements OnInit, AfterViewInit {
  latitude: number = -6.1697791;
  longitude: number = 106.8201155;
  map: any;
  ol: any;
  styles = {
    'geoMarker': new Style({
      image: new CircleStyle({
        radius: 8,
        fill: new Fill({ color: 'blue' }),
        stroke: new Stroke({
          color: 'white', width: 2
        })
      })
    })
  };
  constructor() { }

  ngOnInit() {
    // //
    this.map = new Map({
      target: 'map',
      projection: 'EPSG:4326',
      layers: [
        // new TileLayer({
        //   source: new OSM()
        // })
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        })
      ],
      view: new View({
        // center: transform([-6.1660489, 106.8296376], 'EPSG:3857', 'EPSG:4326'),
        center: fromLonLat([this.longitude, this.latitude]),
        zoom: 8
      })
    });
    this.map.on('singleclick', (event) => {
      // this.longitude = event.coordinate[0];
      // this.latitude = event.coordinate[1];
      //this.setCenter();
      //this.setCenterLocation(event.coordinate[1],event.coordinate[0]);
    });
  }

  ngAfterViewInit() {
    // var mousePositionControl = new ol.control.MousePosition({
    //   coordinateFormat: ol.coordinate.createStringXY(4),
    //   projection: 'EPSG:4326',
    //   // comment the following two lines to have the mouse position
    //   // be placed within the map.
    //   className: 'custom-mouse-position',
    //   target: document.getElementById('mouse-position'),
    //   undefinedHTML: '&nbsp;'
    // });
    // this.map = new ol.Map({
    //   target: 'map',
    //   controls: ol.control.defaults({
    //     attributionOptions: {
    //       collapsible: false
    //     }
    //   }).extend([mousePositionControl]),
    //   layers: [
    //     new ol.layer.Tile({
    //       source: new ol.source.OSM()
    //     })
    //   ],
    //   view: new ol.View({
    //     center: ol.proj.fromLonLat([this.longitude, this.latitude]),
    //     zoom: 8
    //   })
    // });
  }

  setCenterLocation(lon,lat) {
    let geoMarker = new Feature({
      type: 'geoMarker',
      geometry: new Point(fromLonLat([lon, lat]))
    });
    console.log([lon, lat]);
    let layer2 = new LayerVector({
      source: new SourceVector({
        features: [geoMarker]
      }),
      style: this.styles['geoMarker']
    });
    this.map.addLayer(layer2);
    console.log(this.map);
    var view = this.map.getView();
    //view.setCenter(fromLonLat([this.longitude, this.latitude]));
    //view.setZoom(18);
  }

  setCenter() {
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
    view.setZoom(18);
  }
}
