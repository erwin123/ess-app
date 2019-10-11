import { Component, OnInit, Input } from '@angular/core';
import Map from 'ol/Map';
import { Point } from 'ol/geom';
import { Circle as circularPolygon } from 'ol/geom';
import Feature from 'ol/Feature';
import TileLayer from 'ol/layer/Tile';
import LayerVector from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import SourceVector from 'ol/source/Vector';
import View from 'ol/View';
import { Circle as Circle, Fill, Stroke, Style, RegularShape } from 'ol/style';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-check-location',
  templateUrl: './check-location.component.html',
  styleUrls: ['./check-location.component.scss']
})
export class CheckLocationComponent implements OnInit {
  @Input('data') data: any;
  headOffice = [106.8201155, -6.1697791];
  map: any;
  draw: any;
  ol: any;
  message = "";
  styles = {
    'x': new Style({
      image: new RegularShape({
        fill: new Fill({ color: 'rgb(50, 88, 184, 0.9)' }),
        stroke: new Stroke({
          color: 'rgb(50, 88, 184, 0.9)', width: 2
        }),
        points: 4,
        radius: 10,
        radius2: 0,
        angle: Math.PI / 4
      })
    }),
    'circle': new Style({
      image: new Circle({
        radius: 5,
        fill: new Fill({ color: '#ffcc00' }),
        stroke: new Stroke({
          color: '#000000', width: 2
        })
      })
    })
  };
  constructor(public stateService: StateService) { }
  ngOnInit() {
    console.log(this.data)
  }
  ngAfterViewInit() {
    this.map = new Map({
      target: this.data.Identity,
      projection: 'EPSG:4326',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat(this.headOffice),
        zoom: 12
      })
    });
    let zoomVal = 14;
    this.addPoint(this.data.LocOffice, 'x');
    this.addRadius(this.data.LocOffice, this.data.RadiusOffice);
    this.addPoint(this.data.LocUser, 'circle');
    let distance = this.stateService.getDistanceLonLat(this.data.LocOffice, this.data.LocUser);
    if (distance < this.data.RadiusOffice) {
      zoomVal = 16;
      setTimeout(() => {
        this.message = "Lokasi Anda valid."
      }, 0);
    } else {
      zoomVal = 14;
      if (distance - this.data.RadiusOffice > 2000)
        zoomVal = 13;
      if (distance - this.data.RadiusOffice > 5000)
        zoomVal = 10;
      setTimeout(() => {
        this.message = "Perkiraan " + parseInt((distance - this.data.RadiusOffice).toString()) + "meter menuju lokasi.";
      }, 0);
    }
    this.setZoom(this.data.LocOffice, zoomVal);

  }

  addPoint(lonlat, markerShape) {
    let geoMarker = new Feature({
      type: 'geoMarker',
      geometry: new Point(fromLonLat(lonlat))
    });
    let layer = new LayerVector({
      source: new SourceVector({
        features: [geoMarker]
      }),
      style: this.styles[markerShape]
    });
    this.map.addLayer(layer);
  }

  addRadius(lonlat, radius) {
    let circle4326 = new circularPolygon(fromLonLat(lonlat), radius);
    let layer = new LayerVector({
      source: new SourceVector({
        features: [new Feature({
          geometry: circle4326
        })]
      }),
      style: [new Style({
        stroke: new Stroke({
          color: 'blue',
          width: 1
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)'
        })
      })]
    });
    this.map.addLayer(layer);
  }

  setZoom(lonlat, val) {
    let view = this.map.getView();
    view.setCenter(fromLonLat(lonlat));
    view.setZoom(val);
  }

}
