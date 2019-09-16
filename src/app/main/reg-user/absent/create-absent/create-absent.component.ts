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
import { FormGroup, FormControl } from '@angular/forms';
import { AbsentService } from 'src/app/services/absent.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

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
@Component({
  selector: 'app-create-absent',
  templateUrl: './create-absent.component.html',
  styleUrls: ['./create-absent.component.scss']
})
export class CreateAbsentComponent implements OnInit, AfterViewInit {
  @ViewChild('griCam', { static: true }) griCam: ElementRef;
  readonly classes = this.theme.addStyleSheet(styles);
  // toggle webcam on/off
  public showWebcam = false;
  public allowCameraSwitch = true;
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
  lastAbsent = {
    ClockIn: "",
    ClockOut: ""
  }
  clockIn = true;
  validateOnceAllow = true;
  todayDate = "";
  constructor(private route: ActivatedRoute, private theme: LyTheme2,
    private stateService: StateService, private _dialog: LyDialog,
    private absenService: AbsentService) {
    this.credential = this.ls.get('currentUser');
    this.quickProfile = this.credential.quickProfile;
    this.todayDate = moment().format("YYYY-MM-DD");
  }

  ngOnInit() {
    this.getLastAbsen();
    switch (this.route.snapshot.paramMap.get('purpose')) {
      case "1":
        this.title = "Absen Masuk ";
        break;
      case "2":
        this.title = "Absen Keluar ";
        this.clockIn = false;
        break;
      default:
        this.title = "Absen Masuk";
        break;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
      }, err => {
        this.showAlert("Mohon izikan Aplikasi untuk mencatat lokasi pada device Anda!", false);
      });
    }
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
      if (res.length>0) {
        if (res[0].AbsentDate === moment().format("YYYY-MM-DD")) {
          this.lastAbsent = res[0];
          this.lastAbsent.ClockIn = this.lastAbsent.ClockIn ? this.lastAbsent.ClockIn.split('T')[0] + " " + this.lastAbsent.ClockIn.split('T')[1].replace('.000Z', '') : "";
          this.lastAbsent.ClockOut = this.lastAbsent.ClockOut ? this.lastAbsent.ClockOut.split('T')[0] + " " + this.lastAbsent.ClockOut.split('T')[1].replace('.000Z', '') : "";
          if (this.clockIn) {
            this.validateOnceAllow = this.lastAbsent.ClockIn ? false : true;
          } else {
            this.validateOnceAllow = this.lastAbsent.ClockOut && this.lastAbsent.ClockIn ? false : true;
          }
        } else {
          if (!this.clockIn) {
            this.validateOnceAllow = false;
          }
        }
      } else {
        if (!this.clockIn) {
          this.validateOnceAllow = false;
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
    if (this.clockIn) {
      myObj = {
        LongIn: lonlat[0].toString(),
        LatIn: lonlat[1].toString(),
        AbsentDate: moment().format('YYYY-MM-DD'),
        EmployeeID: this.quickProfile.EmployeeID,
        ClockIn: absenDate,
        PhotoIn: filename,
        RowStatus: 1
      }
    } else {
      myObj = {
        LongOut: lonlat[0].toString(),
        LatOut: lonlat[1].toString(),
        AbsentDate: moment().format('YYYY-MM-DD'),
        EmployeeID: this.quickProfile.EmployeeID,
        ClockOut: absenDate,
        PhotoOut: filename,
        RowStatus: 1
      }
    }
    this.absenService.postAbsent(myObj).subscribe(res => {
      callback(res);
    });
  }

  help() {
    this.showAlert("<ul><li>Buka setelan chrome</li><li>Pilih setelan site</li><li>Pilih lokasi/kamera</li><li>Cari 'ess.acset.co', lalu hapus</li><li>Muat ulang halaman, dan pilih izinkan lokasi/kamera akses</li></ul>", false)
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
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
}
