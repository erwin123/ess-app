import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef
} from "@angular/core";
import { Subject } from "rxjs";
import { Observable } from "rxjs";
import { WebcamImage, WebcamInitError, WebcamUtil } from "ngx-webcam";
import { ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import { LyTheme2 } from "@alyle/ui";
import { StateService } from "src/app/services/state.service";
import { DialogInfoComponent } from "src/app/alert/dialog-info/dialog-info.component";
import { LyDialog } from "@alyle/ui/dialog";
import * as SecureLS from "secure-ls";
import { AbsentService } from "src/app/services/absent.service";
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { MyLocationComponent } from "../my-location/my-location.component";
declare var faceapi: any;

const styles = {
  root: {
    position: "absolute",
    top: "0px",
    fontWeight: "bold"
  },
  action: {
    width: "100%",
    position: "relative"
  }
};

const styleShowMap = {
  width: "100vw",
  height: "100vh",
  borderRadius: 0
};
@Component({
  selector: "app-create-absent",
  templateUrl: "./create-absent.component.html",
  styleUrls: ["./create-absent.component.scss"]
})
export class CreateAbsentComponent implements OnInit, AfterViewInit {
  @ViewChild("griCam", { static: true }) griCam: ElementRef;
  @ViewChild("canvasCamera", { static: false }) canvasCamera: ElementRef;
  public context: CanvasRenderingContext2D;
  config: any;
  labelDescriptor = [];
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
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();
  title = "";
  scrWidth: any;
  scrHeight: any;
  myDate = moment().format("YYYY-MM-DD HH:mm:ss");
  captureDate = moment().format("YYYY-MM-DD HH:mm:ss");
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
  nearLocation;
  constructor(
    private route: ActivatedRoute,
    private theme: LyTheme2,
    private stateService: StateService,
    private _dialog: LyDialog,
    private absenService: AbsentService
  ) {
    // this.credential = this.ls.get('currentUser');
    // this.quickProfile = this.credential.quickProfile;

    this.stateService.currentCredential.subscribe(cr => {
      this.credential = cr;
      this.quickProfile = cr.quickProfile;
    });
    this.todayDate = moment().format("YYYY-MM-DD");
    this.config = this.stateService.getConfig();
  }

  ngOnInit() {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("assets/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("assets/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("assets/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("assets/models")
    ]).then(async data => {
      if (this.credential.quickProfile.Photo) {
        let faceImg = await faceapi.fetchImage(
          this.config.Api.profile +
            this.credential.Username +
            "/" +
            this.credential.quickProfile.Photo
        );
        const detections = await faceapi
          .detectAllFaces(faceImg, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions()
          .withFaceDescriptors();
        this.labelDescriptor.push(
          new faceapi.LabeledFaceDescriptors(this.credential.Username, [
            detections[0].descriptor
          ])
        );
      }
    });
    this.getLastAbsen();

    switch (this.route.snapshot.paramMap.get("purpose")) {
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
      navigator.geolocation.getCurrentPosition(
        position => {
          this.currentPosition = [
            position.coords.longitude,
            position.coords.latitude
          ];
        },
        err => {
          this.showAlert(
            "Mohon izikan Aplikasi untuk mencatat lokasi pada device Anda!",
            false
          );
        },
        { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true }
      );
    }

    this.quickProfile.ClockIn =
      this.quickProfile.ClockIn.split("T").length == 2
        ? this.quickProfile.ClockIn.split("T")[1].replace(".000Z", "")
        : this.quickProfile.ClockIn;
    this.quickProfile.ClockOut =
      this.quickProfile.ClockOut.split("T").length == 2
        ? this.quickProfile.ClockOut.split("T")[1].replace(".000Z", "")
        : this.quickProfile.ClockOut;
  }

  ngAfterViewInit(): void {
    /* Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("assets/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("assets/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("assets/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("assets/models")
    ]).then(async data => {
      if (this.credential.quickProfile.Photo) {
        let faceImg = await faceapi.fetchImage(
          this.config.Api.profile +
            this.credential.Username +
            "/" +
            this.credential.quickProfile.Photo
        );
        const detections = await faceapi
          .detectAllFaces(faceImg, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions()
          .withFaceDescriptors();
        this.labelDescriptor.push(
          new faceapi.LabeledFaceDescriptors(this.credential.Username, [
            detections[0].descriptor
          ])
        );
      }
    }); */
    this.scrWidth = this.griCam.nativeElement.offsetWidth;
    this.scrHeight = this.griCam.nativeElement.offsetHeight;
    setInterval(() => {
      this.myDate = moment().format("YYYY-MM-DD HH:mm:ss");
    }, 1000);
    setTimeout(() => {
      this.showWebcam = true;
      if (this.canvasCamera) {
        console.log(this.canvasCamera);
        console.log(this.griCam);
        let offsetx = this.canvasCamera.nativeElement.offsetLeft;
        let offsety = this.canvasCamera.nativeElement.offsetTop;
        let offseth = this.griCam.nativeElement.offsetHeight;
        let offsetw = this.griCam.nativeElement.offsetWidth;
        this.context = (<HTMLCanvasElement>(
          this.canvasCamera.nativeElement
        )).getContext("2d");
        const x =
          (this.canvasCamera.nativeElement as HTMLCanvasElement).width / 2;

        const y =
          (this.canvasCamera.nativeElement as HTMLCanvasElement).height / 2;
        this.context.beginPath();
        console.log(offsetw, offseth, offsetx, offsety);
        this.context.rect(
          0,
          y - 15,
          this.griCam.nativeElement.offsetWidth,
          this.griCam.nativeElement.offsetHeight
        );
        this.context.fillStyle = "rgba(0,0,0,0.9)";
        this.context.fill();
        /*  this.context.beginPath();
        this.context.scale(0.7, 1);
        this.context.globalCompositeOperation = "destination-out";
        this.context.arc(
          (offsetw / 2) * 1.4,
          offseth,
          offsetw / 2,
          0,
          2 * Math.PI
        );
        this.context.fill(); */
      }
    }, 500);
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }
    );
  }

  getLastAbsen() {
    this.absenService.getLast(this.quickProfile.EmployeeID).subscribe(res => {
      if (res.length > 0) {
        if (res[0].AbsentDate === moment().format("YYYY-MM-DD")) {
          this.lastAbsent = res[0];
          this.lastAbsent.ClockIn = this.lastAbsent.ClockIn
            ? this.lastAbsent.ClockIn.split("T")[0] +
              " " +
              this.lastAbsent.ClockIn.split("T")[1].replace(".000Z", "")
            : null;
          this.lastAbsent.ClockOut = this.lastAbsent.ClockOut
            ? this.lastAbsent.ClockOut.split("T")[0] +
              " " +
              this.lastAbsent.ClockOut.split("T")[1].replace(".000Z", "")
            : null;

          if (this.clockIn) {
            this.validateOnceAllow = this.lastAbsent.ClockIn ? false : true;
          } else {
            this.validateOnceAllow =
              (this.lastAbsent.ClockIn && this.lastAbsent.ClockOut) ||
              (!this.lastAbsent.ClockIn && !this.lastAbsent.ClockOut)
                ? false
                : true;
          }
        } else {
          if (!this.clockIn) {
            this.validateOnceAllow = false;
          } else {
            this.validateOnceAllow = true;
          }
        }
      } else {
        if (!this.clockIn) {
          this.validateOnceAllow = false;
        } else {
          this.validateOnceAllow = true;
        }
      }
    });
  }

  showAlert(msg: string, err: boolean) {
    this.stateService.setBlocking(0);
    const dialogRefInfo = this._dialog.open<DialogInfoComponent>(
      DialogInfoComponent,
      {
        data: { Message: msg, err: err }
      }
    );
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
    this.showAlert(
      "Mohon izikan Aplikasi mengakses Kamera pada device Anda!",
      false
    );
  }

  public async handleImage(webcamImage: WebcamImage) {
    if (this.credential) {
      if (this.credential.quickProfile.AttendanceLocations.length == 0) {
        this.showAlert(
          "<b>Lokasi absen belum terdefinisi, silahkan hubungin Admin.</b>",
          true
        );
        return;
      }
      if (!this.credential.quickProfile.Photo) {
        this.showAlert("Silahkan upload photo profile terlebih dahulu!", false);
        return;
      }
      let faceWebCam = await faceapi.fetchImage(webcamImage.imageAsDataUrl);
      const detections = await faceapi
        .detectAllFaces(faceWebCam, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withFaceDescriptors();
      if (detections.length === 0) {
        this.showAlert("Wajak tidak terdeteksi, silahkan coba kembali!", false);
        return;
      }
      let faceMatcher = new faceapi.FaceMatcher(this.labelDescriptor);
      let bestMatch = faceMatcher.findBestMatch(detections[0].descriptor);
      if (bestMatch.distance > 0.4) {
        this.showAlert("Wajak tidak dikenali, silahkan coba kembali!", false);
        return;
      }
      this.stateService.setBlocking(1);
      this.captureDate = moment().format("YYYY-MM-DD HH:mm:ss");
      let imgFile: File = this.dataURLtoFile(
        webcamImage.imageAsDataUrl,
        "absenFoto"
      );

      this.absenService.postUpload(imgFile, "image").subscribe(
        event => {
          let eventRes: any;
          if (event.type === HttpEventType.UploadProgress) {
            this.progressPercent = Math.round(
              (100 * event.loaded) / event.total
            );
            // console.log(this.progressPercent);
          }
          if (event instanceof HttpResponse) {
            eventRes = event.body;
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                position => {
                  // console.log(position.coords);
                  this.lonlat = [
                    position.coords.longitude,
                    position.coords.latitude
                  ];
                  this.postAbsen(
                    this.lonlat,
                    this.captureDate,
                    eventRes.filename,
                    result => {
                      if (result) {
                        setTimeout(() => {
                          this.getLastAbsen();
                        }, 1000);
                        this.showAlert(
                          "<b>Absen telah tercatat</b><br/><br/> Waktu<br/>" +
                            this.captureDate +
                            "<br/>Lokasi <br/>" +
                            this.lonlat[0] +
                            "<br/>" +
                            this.lonlat[1],
                          false
                        );
                      }
                    }
                  );
                },
                errGetLonlat => {
                  this.postAbsen(
                    this.lonlat,
                    this.captureDate,
                    eventRes.filename,
                    result => {
                      if (result) {
                        setTimeout(() => {
                          this.getLastAbsen();
                        }, 1000);
                        this.showAlert(
                          "<b>Absen telah tercatat, namun gagal mengambil lokasi.</b><br/><br/> Waktu<br/>" +
                            this.captureDate +
                            "<br/>Lokasi <br/>" +
                            this.lonlat[0] +
                            "<br/>" +
                            this.lonlat[1],
                          true
                        );
                      }
                    }
                  );
                },
                { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true }
              );
            }
          }
        },
        errUpload => {
          console.error(errUpload);
          this.showAlert("<b>Absen gagal, mohon cek jaringan Anda</b>", true);
        }
      );
      this.webcamImage = webcamImage;
    } else {
      this.showAlert(
        "Terjadi kesalahan, sesi habis, silahkan lakukan login ulang",
        true
      );
    }
  }

  postAbsen(lonlat, absenDate, filename, callback) {
    let myObj: any;
    //1|1 valid all , 1|2 invalid loc, 2|1 invalid time, 2|2 invalid all
    let validation = this.checkValid(
      lonlat,
      absenDate,
      this.clockIn ? true : false
    );
    myObj = {
      LongIn: lonlat[0].toString(),
      LatIn: lonlat[1].toString(),
      LongOut: lonlat[0].toString(),
      LatOut: lonlat[1].toString(),
      LocationID: this.nearLocation.LocationID,
      AbsentDate: moment().format("YYYY-MM-DD"),
      EmployeeID: this.quickProfile.EmployeeID,
      ClockIn: absenDate,
      PhotoIn: filename,
      RowStatus: 1,
      ClockOut: absenDate,
      PhotoOut: filename,
      StatusIn: validation,
      StatusOut: validation //,
      //Status: validation ==="1|1"? 1 : 2 //    0:rejected, 1: valid, 2: need approval, 3: approved
    };
    if (this.clockIn) {
      delete myObj.ClockOut;
      delete myObj.PhotoOut;
      delete myObj.LongOut;
      delete myObj.LatOut;
      delete myObj.StatusOut;
      myObj.Status = this.lastAbsent.StatusIn === "1|1" ? 1 : 2;
    } else {
      delete myObj.ClockIn;
      delete myObj.PhotoIn;
      delete myObj.LatIn;
      delete myObj.LongIn;
      delete myObj.StatusIn;
      myObj.Status =
        this.lastAbsent.StatusIn === "1|1" &&
        this.lastAbsent.StatusOut === "1|1"
          ? 1
          : 2;
    }
    if (!this.clockIn) {
      var duration = moment.duration(
        moment(moment(myObj.ClockOut).format("HH:mm:ss"), "HH:mm:ss").diff(
          moment(moment(this.quickProfile.ClockOut, "HH:mm:ss"))
        )
      );
      var hours = duration.asHours();
      if (hours >= 3) {
        this.absenService.postAbsent(myObj).subscribe(res => {
          this.absenService.postAbsent(myObj, true).subscribe(res => {
            myObj.ClockIn = moment(
              this.quickProfile.ClockOut,
              "HH:mm:ss"
            ).format("YYYY-MM-DD HH:mm:ss");
            myObj.PhotoIn = myObj.PhotoOut;
            myObj.LongIn = myObj.LongOut;
            myObj.LatIn = myObj.LatOut;
            myObj.StatusIn = myObj.StatusOut;
            delete myObj.ClockOut;
            delete myObj.PhotoOut;
            delete myObj.LongOut;
            delete myObj.LatOut;
            delete myObj.StatusOut;
            this.absenService.postAbsent(myObj, true).subscribe(res => {
              callback(res);
            });
          });
        });
      } else {
        this.absenService.postAbsent(myObj).subscribe(res => {
          callback(res);
        });
      }
    } else {
      this.absenService.postAbsent(myObj).subscribe(res => {
        callback(res);
      });
    }
  }

  checkValid(currentLonLat, absenDate, clockIn) {
    let checkLate;
    for (
      let index = 0;
      index < this.quickProfile.AttendanceLocations.length;
      index++
    ) {
      const element = this.quickProfile.AttendanceLocations[index];
      let distance = this.stateService.getDistanceLonLat(
        [Number(element.Long), Number(element.Lat)],
        currentLonLat
      );
      this.quickProfile.AttendanceLocations[
        index
      ].DistanceToLocation = distance;
    }
    this.nearLocation = this.quickProfile.AttendanceLocations.reduce(
      (prev, curr) => {
        return prev.DistanceToLocation < curr.DistanceToLocation ? prev : curr;
      }
    );
    if (clockIn)
      checkLate = moment(
        moment(absenDate).format("HH:mm:ss"),
        "HH:mm:ss"
      ).isBefore(moment(this.quickProfile.ClockIn, "HH:mm:ss"));
    else
      checkLate = moment(
        moment(absenDate).format("HH:mm:ss"),
        "HH:mm:ss"
      ).isAfter(moment(this.quickProfile.ClockOut, "HH:mm:ss"));

    let result = checkLate ? "1" : "2";
    let distance = this.stateService.getDistanceLonLat(
      [Number(this.nearLocation.Long), Number(this.nearLocation.Lat)],
      currentLonLat
    );
    if (distance < this.nearLocation.Radius) {
      return result + "|1";
    } else {
      return result + "|2";
    }
  }

  help() {
    this.showAlert(
      "<ul><li>Buka setelan chrome</li><li>Pilih setelan site</li><li>Pilih lokasi/kamera</li><li>Cari 'ess.acset.co', lalu hapus</li><li>Muat ulang halaman, dan pilih izinkan lokasi/kamera akses</li></ul>",
      false
    );
  }

  showMap() {
    if (this.credential.quickProfile.AttendanceLocations.length == 0) {
      this.showAlert(
        "<b>Lokasi absen belum terdefinisi, silahkan hubungin Admin.</b>",
        true
      );
      return;
    }
    console.log(this.credential.quickProfile);
    this.stateService.setBlocking(0);
    navigator.geolocation.getCurrentPosition(position => {
      let currentLonLat = [position.coords.longitude, position.coords.latitude];
      for (
        let index = 0;
        index < this.quickProfile.AttendanceLocations.length;
        index++
      ) {
        const element = this.quickProfile.AttendanceLocations[index];
        let distance = this.stateService.getDistanceLonLat(
          [Number(element.Long), Number(element.Lat)],
          currentLonLat
        );
        this.quickProfile.AttendanceLocations[
          index
        ].DistanceToLocation = distance;
      }
      console.log(this.quickProfile.AttendanceLocations);
      this.nearLocation = this.quickProfile.AttendanceLocations.reduce(
        (prev, curr) => {
          return prev.DistanceToLocation < curr.DistanceToLocation
            ? prev
            : curr;
        }
      );
      const dialogLoc = this._dialog.open<MyLocationComponent>(
        MyLocationComponent,
        {
          data: {
            LocOffice: [
              Number(this.nearLocation.Long),
              Number(this.nearLocation.Lat)
            ],
            RadiusOffice: Number(this.nearLocation.Radius),
            LocUser: this.currentPosition,
            Identity: "showMap"
          },
          maxWidth: null, // current style overrides
          maxHeight: null, // current style overrides
          containerClass: this.theme.style(styleShowMap)
        }
      );
      dialogLoc.afterClosed.subscribe(() => {});
    });
  }

  dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
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
