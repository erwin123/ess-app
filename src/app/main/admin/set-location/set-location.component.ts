import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import Map from 'ol/Map';
import { Draw } from 'ol/interaction';
import { ScaleLine, Zoom, Rotate } from 'ol/control';
import { Point } from 'ol/geom';
import { Circle as circularPolygon } from 'ol/geom';
import Feature from 'ol/Feature';
import TileLayer from 'ol/layer/Tile';
import LayerVector from 'ol/layer/Vector';
import { fromLonLat, transform, METERS_PER_UNIT } from 'ol/proj';
import OSM from 'ol/source/OSM';
import SourceVector from 'ol/source/Vector';
import View from 'ol/View';
import { Circle as Circle, Fill, Icon, Stroke, Style } from 'ol/style';
import * as Geocoder from 'ol-geocoder';
import { LyTheme2, shadowBuilder, ThemeVariables } from '@alyle/ui';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MasterService } from 'src/app/services/master.service';
import { StateService } from 'src/app/services/state.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LyDialog } from '@alyle/ui/dialog';
import { DialogInfoComponent } from 'src/app/alert/dialog-info/dialog-info.component';
const thmstyles = (theme: ThemeVariables) => ({
  container: {
    maxWidth: '100%'
  },
  item: {
    padding: '16px',
    textAlign: 'center',
    background: theme.background.secondary,
    boxShadow: shadowBuilder(1),
    borderRadius: '4px',
    height: '100%'
  },
  switch: {
    border: 'solid #34eb43 1px',
    borderRadius: '5px',
    width: '146px'
  },
  errMsg: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: '20px',
    textAlign: 'center'
  }
});

@Component({
  selector: 'app-set-location',
  templateUrl: './set-location.component.html',
  styleUrls: ['./set-location.component.scss']
})
export class SetLocationComponent implements OnInit, AfterViewInit {

  readonly classes = this.theme.addStyleSheet(thmstyles);
  headOffice = [106.8201155, -6.1697791];
  pickedLonLat = [0, 0];
  map: any;
  draw: any;
  ol: any;
  errMsg = "";
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
  locationForm = new FormGroup({
    Id: new FormControl({ value: '', disabled: true }),
    LocationName: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100)
    ]),
    LocationAddress: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(200)
    ]),
    Long: new FormControl({ value: '', disabled: true }, Validators.required),
    Lat: new FormControl({ value: '', disabled: true }, Validators.required),
    Radius: new FormControl({ value: '', disabled: true }, Validators.required),
    RowStatus: new FormControl(true, null),
    CreateDate: new FormControl({ value: '', disabled: true }),
    CreateBy: new FormControl({ value: '', disabled: true }),
    UpdateBy: new FormControl({ value: '', disabled: true }),
    UpdateDate: new FormControl({ value: '', disabled: true })
  });

  constructor(private theme: LyTheme2, private router: Router,
    private masterService: MasterService, private stateService: StateService,
    private route: ActivatedRoute, private _dialog: LyDialog) { }

  ngAfterViewInit() {
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

    let source = new SourceVector({ wrapX: false });
    this.setupDraw(source);
    this.map.addLayer(this.setupLayer(source));
    this.map.addInteraction(this.draw);

    //clear previous first
    this.draw.on('drawstart', (e) => {
      // console.log(source.getFeatures());
      // console.log(source.getLayers());
      //clear
      source.getFeatures().forEach(el => {
        source.removeFeature(el, true);
      });
      this.map.getLayers().forEach(el => {
        if (el) {
          try {
            if (el.constructor.name === "VectorLayer" || el.type === "VECTOR") {
              let features = el.getSource().getFeatures();
              if (features.length > 0) {
                this.map.removeLayer(el);
              }
            }
          } catch (e) {
            console.log(e);
          }
        }
      });
    })

    this.draw.on('drawend', (e) => {
      //clear
      source.getFeatures().forEach(el => {
        source.removeFeature(el, true);
      });
      this.map.getLayers().forEach(el => {
        if (el) {
          try {
            if (el.constructor.name === "VectorLayer" || el.type === "VECTOR") {
              let features = el.getSource().getFeatures();
              if (features.length > 0) {
                this.map.removeLayer(el);
              }
            }
          } catch (e) {

          }
        }
      });

      let circleFeature = e.feature.getGeometry();
      let units = this.map.getView().getProjection().getUnits();
      let center = circleFeature.getCenter();
      let radius = circleFeature.getRadius();
      this.pickedLonLat = transform(center, 'EPSG:3857', 'EPSG:4326');
      console.log("POINT: " + transform(center, 'EPSG:3857', 'EPSG:4326'));
      console.log("RADIUS: " + radius * METERS_PER_UNIT[units]);
      this.addPoint(this.pickedLonLat);
      //this.addRadius(this.pickedLonLat, radius);
      this.locationForm.controls['Long'].setValue(this.pickedLonLat[0]);
      this.locationForm.controls['Lat'].setValue(this.pickedLonLat[1]);
      this.locationForm.controls['Radius'].setValue(radius * METERS_PER_UNIT[units]);

    });
    //this.map.addControl(this.setupSearch());

    this.route.queryParams.subscribe(params => {
      if (params.mode == 1 && params.id) { //view
        this.masterService.getLocation({ Id: params.id }).subscribe(res => {
          let myLoc = res[0];
          this.addPoint([Number(myLoc.Long), Number(myLoc.Lat)]);
          this.addRadius([Number(myLoc.Long), Number(myLoc.Lat)], Number(myLoc.Radius));
          this.setZoom([Number(myLoc.Long), Number(myLoc.Lat)], 16);
          this.locationForm.setValue(myLoc);
        })
      }
    });
  }
  ngOnInit() {


  }

  showAlert(msg: string, err: boolean) {
    this.stateService.setBlocking(0);
    const dialogRefInfo = this._dialog.open<DialogInfoComponent>(DialogInfoComponent, {
      data: { Message: msg, err: err }
    });
    dialogRefInfo.afterClosed.subscribe(() => {
      this.router.navigate(['main/admin/maintain-location']);
    });
  }
  onSubmit() {
    if (this.locationForm.valid) {
      if (this.locationForm.controls['Radius'].value) {
        let myObj: any = this.locationForm.value;
        myObj.Long = this.locationForm.controls["Long"].value.toString();
        myObj.Lat = this.locationForm.controls["Lat"].value.toString();
        myObj.Radius = this.locationForm.controls["Radius"].value.toString();
        myObj.RowStatus = this.locationForm.controls["RowStatus"].value ? 1 : 0;
        if (this.locationForm.controls["Id"].value > 0) {
          myObj.Id = this.locationForm.controls["Id"].value;
          this.masterService.putLocation(myObj).subscribe(res => {
            this.showAlert("Data berhasil disimpan", false);
          });
        } else {
          this.masterService.postLocation(myObj).subscribe(res => {
            this.showAlert("Data berhasil disimpan", false);
          });
        }
      } else {
        this.errMsg = "Data lokasi memerlukan titik koordinat";
        setTimeout(() => {
          this.errMsg = "";
        }, 5000);
      }
    } else {
      this.errMsg = "Data lokasi memerlukan nama dan alamat";
      setTimeout(() => {
        this.errMsg = "";
      }, 5000);
    }
  }

  switchChange(val) {
    this.locationForm.controls['RowStatus'].setValue(val);
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

  get locationName() {
    return this.locationForm.get('LocationName')!;
  }

  get locationAddress() {
    return this.locationForm.get('LocationAddress')!;
  }

  get rowStatus() {
    return this.locationForm.get('RowStatus').value;
  }
}
