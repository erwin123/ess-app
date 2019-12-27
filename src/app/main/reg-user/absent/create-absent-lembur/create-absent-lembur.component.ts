import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { LyTheme2 } from '@alyle/ui';
import { StateService } from 'src/app/services/state.service';
import { DialogInfoComponent } from 'src/app/alert/dialog-info/dialog-info.component';
import { LyDialog } from '@alyle/ui/dialog';
import * as SecureLS from 'secure-ls';
import { AbsentService } from 'src/app/services/absent.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MyLocationComponent } from '../my-location/my-location.component';

const styles = ({
  root: {
    position: 'absolute',
    top: '0px',
    fontWeight: 'bold'
  },
  action: {
    width: '100%',
    position: 'relative'
  }
});

const styleShowMap = ({
  width: '100vw',
  height: '100vh',
  borderRadius: 0
});
@Component({
  selector: 'app-create-absent-lembur',
  templateUrl: './create-absent-lembur.component.html',
  styleUrls: ['../create-absent/create-absent.component.scss']
})
export class CreateAbsentLemburComponent implements OnInit {
  @ViewChild('griCam', { static: true }) griCam: ElementRef;
  readonly classes = this.theme.addStyleSheet(styles);
  // toggle webcam on/off
  public showWebcam = false;
  public allowCameraSwitch = false;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  title = "";
  scrWidth: any;
  myDate = moment().format('YYYY-MM-DD HH:mm:ss');
  captureDate = moment().format('YYYY-MM-DD HH:mm:ss');
  credential: any;
  lonlat = [0, 0];
  ls = new SecureLS();

  quickProfile: any;
  progressPercent = 0;
  // lastAbsent = {
  //   ClockIn: "",
  //   ClockOut: ""
  // }
  lastAbsent;
  clockIn = true;
  validateOnceAllow = false;
  todayDate = "";
  currentPosition = [0, 0];
  constructor(private route: ActivatedRoute, private theme: LyTheme2,
    private stateService: StateService, private _dialog: LyDialog,
    private absenService: AbsentService) {
    // this.credential = this.ls.get('currentUser');
    // this.quickProfile = this.credential.quickProfile;

    this.stateService.currentCredential.subscribe(cr => {
      this.credential = cr;
      this.quickProfile = cr.quickProfile;
    })
    this.todayDate = moment().format("YYYY-MM-DD");
  }

  ngOnInit() {
    this.getLastAbsen();

    switch (this.route.snapshot.paramMap.get('purpose')) {
      case "1":
        this.title = "Lembur Absen Masuk ";
        break;
      case "2":
        this.title = "Lembur Absen Keluar ";
        this.clockIn = false;
        break;
      default:
        this.title = "Lembur Absen Masuk";
        break;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.currentPosition = [position.coords.longitude, position.coords.latitude];
      }, err => {
        this.showAlert("Mohon izikan Aplikasi untuk mencatat lokasi pada device Anda!", false);
      }, { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true });
    }

    this.quickProfile.ClockIn = this.quickProfile.ClockIn.split('T').length == 2 ? this.quickProfile.ClockIn.split('T')[1].replace('.000Z', '') : this.quickProfile.ClockIn;
    this.quickProfile.ClockOut = this.quickProfile.ClockOut.split('T').length == 2 ? this.quickProfile.ClockOut.split('T')[1].replace('.000Z', '') : this.quickProfile.ClockOut;

  }

  ngAfterViewInit() {
    this.scrWidth = this.griCam.nativeElement.offsetWidth;
    setInterval(() => {
      this.myDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }, 1000);
    setTimeout(() => {
      this.showWebcam = true;
    }, 500);
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      })
  }

  getLastAbsen() {
    this.absenService.getLast(this.quickProfile.EmployeeID).subscribe(res => {
      if (res.length > 0) {
        if (res[0].AbsentDate === moment().format("YYYY-MM-DD")) {
          this.lastAbsent = res[0];
          this.lastAbsent.ClockIn = this.lastAbsent.ClockIn ? this.lastAbsent.ClockIn.split('T')[0] + " " + this.lastAbsent.ClockIn.split('T')[1].replace('.000Z', '') : "";
          this.lastAbsent.ClockOut = this.lastAbsent.ClockOut ? this.lastAbsent.ClockOut.split('T')[0] + " " + this.lastAbsent.ClockOut.split('T')[1].replace('.000Z', '') : "";

          //lembur
          if (this.lastAbsent.ClockIn && this.lastAbsent.ClockOut) {
            this.absenService.getLast(this.quickProfile.EmployeeID, true).subscribe(resLembur => {
              if (resLembur.length > 0) {
                if (resLembur[0].AbsentDate === moment().format("YYYY-MM-DD")) {
                  this.lastAbsent = resLembur[0];
                  this.lastAbsent.ClockIn = this.lastAbsent.ClockIn ? this.lastAbsent.ClockIn.split('T')[0] + " " + this.lastAbsent.ClockIn.split('T')[1].replace('.000Z', '') : "";
                  this.lastAbsent.ClockOut = this.lastAbsent.ClockOut ? this.lastAbsent.ClockOut.split('T')[0] + " " + this.lastAbsent.ClockOut.split('T')[1].replace('.000Z', '') : "";
                  if (this.clockIn) {
                    this.validateOnceAllow = this.lastAbsent.ClockIn ? false : true;
                  } else {
                    this.validateOnceAllow = this.lastAbsent.ClockOut && this.lastAbsent.ClockIn ? false : true;
                  }
                }else {
                  if (!this.clockIn) {
                    this.validateOnceAllow = false;
                  } else {
                    this.validateOnceAllow = true;
                  }
                }
              } else {
                this.lastAbsent = {};
                if (!this.clockIn) {
                  this.validateOnceAllow = false;
                } else {
                  this.validateOnceAllow = true;
                }
              }
            })
          } else {
            this.lastAbsent = {};
            if (!this.clockIn) {
              this.validateOnceAllow = false;
            } else {
              this.validateOnceAllow = true;
            }
            this.validateOnceAllow = false;
          }
          //end
        }
      }
    })
  }

  showAlert(msg: string, err: boolean) {
    this.stateService.setBlocking(0);
    const dialogRefInfo = this._dialog.open<DialogInfoComponent>(DialogInfoComponent, {
      data: { Message: msg, err: err }
    });
    dialogRefInfo.afterClosed.subscribe(() => {
      this.webcamImage = null;
      this.lonlat = [0, 0];
    });
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
    this.showAlert("Mohon izikan Aplikasi mengakses Kamera pada device Anda!", false);
  }

  public handleImage(webcamImage: WebcamImage): void {
    if (this.credential) {
      this.stateService.setBlocking(1);
      this.captureDate = moment().format('YYYY-MM-DD HH:mm:ss');
      let imgFile: File = this.dataURLtoFile(webcamImage.imageAsDataUrl, "absenFoto");

      this.absenService.postUpload(imgFile, "image").subscribe(event => {
        let eventRes: any;
        if (event.type === HttpEventType.UploadProgress) {
          this.progressPercent = Math.round(100 * event.loaded / event.total);
          console.log(this.progressPercent);
        }
        if (event instanceof HttpResponse) {
          eventRes = event.body;
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
              console.log(position.coords)
              this.lonlat = [position.coords.longitude, position.coords.latitude];
              this.postAbsen(this.lonlat, this.captureDate, eventRes.filename, result => {
                if (result) {
                  setTimeout(() => {
                    this.getLastAbsen();
                  }, 1000);
                  this.showAlert("<b>Absen telah tercatat</b><br/><br/> Waktu<br/>" + this.captureDate + "<br/>Lokasi <br/>" + this.lonlat[0] + "<br/>" + this.lonlat[1], false);
                }

              });
            }, errGetLonlat => {
              this.postAbsen(this.lonlat, this.captureDate, eventRes.filename, result => {
                if (result) {
                  setTimeout(() => {
                    this.getLastAbsen();
                  }, 1000);
                  this.showAlert("<b>Absen telah tercatat, namun gagal mengambil lokasi.</b><br/><br/> Waktu<br/>" + this.captureDate + "<br/>Lokasi <br/>" + this.lonlat[0] + "<br/>" + this.lonlat[1], true);
                }

              });
            }, { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true });
          }

        }
      }, errUpload => {
        console.log(errUpload);
        this.showAlert("<b>Absen gagal, mohon cek jaringan Anda</b>", true);
      });
      this.webcamImage = webcamImage;
    } else {
      this.showAlert("Terjadi kesalahan, sesi habis, silahkan lakukan login ulang", true);
    }
  }

  postAbsen(lonlat, absenDate, filename, callback) {
    let myObj: any;
    //1|1 valid all , 1|2 invalid loc, 2|1 invalid time, 2|2 invalid all
    let validation = this.checkValid(lonlat, absenDate, this.clockIn ? true : false);
    myObj = {
      LongIn: lonlat[0].toString(),
      LatIn: lonlat[1].toString(),
      LongOut: lonlat[0].toString(),
      LatOut: lonlat[1].toString(),
      AbsentDate: moment().format('YYYY-MM-DD'),
      EmployeeID: this.quickProfile.EmployeeID,
      ClockIn: absenDate,
      PhotoIn: filename,
      RowStatus: 1,
      ClockOut: absenDate,
      PhotoOut: filename,
      StatusIn: validation,
      StatusOut: validation//,
      //Status: validation ==="1|1"? 1 : 2 //    0:rejected, 1: valid, 2: need approval, 3: approved
    }
    if (this.clockIn) {
      delete myObj.ClockOut;
      delete myObj.PhotoOut;
      delete myObj.LongOut;
      delete myObj.LatOut;
      delete myObj.StatusOut;
    } else {
      delete myObj.ClockIn;
      delete myObj.PhotoIn;
      delete myObj.LatIn;
      delete myObj.LongIn;
      delete myObj.StatusIn;
      myObj.Status = this.lastAbsent.StatusIn === "1|1" && this.lastAbsent.StatusOut === "1|1" ? 1 : 2;
      myObj.Status = 2; //force approval
    }
    this.absenService.postAbsent(myObj, true).subscribe(res => {
      callback(res);
    });
  }

  checkValid(currentLonLat, absenDate, clockIn) {
    let checkLate;
    if (clockIn)
      checkLate = moment(moment(absenDate).format('HH:mm:ss'), 'HH:mm:ss').isBefore(moment(this.quickProfile.ClockIn, 'HH:mm:ss'));
    else
      checkLate = moment(moment(absenDate).format('HH:mm:ss'), 'HH:mm:ss').isAfter(moment(this.quickProfile.ClockOut, 'HH:mm:ss'));

    let result = checkLate ? "1" : "2";
    let distance = this.stateService.getDistanceLonLat([Number(this.quickProfile.Long), Number(this.quickProfile.Lat)], currentLonLat);
    if (distance < this.quickProfile.Radius) {
      return result + "|1";
    } else {
      return result + "|2";
    }
  }

  help() {
    this.showAlert("<ul><li>Buka setelan chrome</li><li>Pilih setelan site</li><li>Pilih lokasi/kamera</li><li>Cari 'ess.acset.co', lalu hapus</li><li>Muat ulang halaman, dan pilih izinkan lokasi/kamera akses</li></ul>", false)
  }

  showMap() {
    this.stateService.setBlocking(0);
    const dialogLoc = this._dialog.open<MyLocationComponent>(MyLocationComponent, {
      data: {
        LocOffice: [Number(this.quickProfile.Long), Number(this.quickProfile.Lat)],
        RadiusOffice: Number(this.quickProfile.Radius),
        LocUser: this.currentPosition,
        Identity: "showMap"
      },
      maxWidth: null, // current style overrides
      maxHeight: null, // current style overrides
      containerClass: this.theme.style(styleShowMap)
    });
    dialogLoc.afterClosed.subscribe(() => {

    });
  }

  dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
}
