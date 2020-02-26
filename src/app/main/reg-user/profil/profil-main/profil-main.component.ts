import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit
} from "@angular/core";
import { LyTheme2, ThemeVariables, ThemeRef } from "@alyle/ui";
import { FormGroup } from "@angular/forms";
import { MasterService } from "src/app/services/master.service";
import { forkJoin } from "rxjs";
import * as moment from "moment";
import { StateService } from "src/app/services/state.service";
import { NgxImageCompressService } from "ngx-image-compress";
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { LyDialog } from "@alyle/ui/dialog";
import { DialogInfoComponent } from "src/app/alert/dialog-info/dialog-info.component";
import { EmployeeService } from "src/app/services/employee.service";
import { AccountService } from "src/app/services/account.service";
import { ActivatedRoute } from "@angular/router";
import { ProfileItemsComponent } from "../profile-items/profile-items.component";
import { STYLES as EXPANSION_STYLES } from "@alyle/ui/expansion";
import { ProfilMainFieldComponent } from "../profil-main-field/profil-main-field.component";
declare var faceapi: any;

const STYLES = (theme: ThemeVariables, themeRef: ThemeRef) => {
  // The classes for `expansion` are not yet created, therefore,
  // we will create them to use them.
  const expansion = themeRef.toClassSelector(
    themeRef.addStyleSheet(EXPANSION_STYLES)
  );

  return {
    expansion: {
      [`${expansion.panel}`]: {
        "&::after": {
          transition: `border ${theme.animations.durations.entering}ms ${theme.animations.curves.standard}`,
          content: `''`,
          position: "absolute",
          top: 0,
          bottom: 0,
          before: 0,
          borderBefore: "2px solid transparent"
        }
      },
      [`${expansion.panelHeader}`]: {
        height: "54px"
      },
      [`${expansion.panelTitle}`]: {
        fontWeight: 500
      },

      // When it is expanded
      [`${expansion.expanded}`]: {
        [`${expansion.panelHeader}`]: {
          height: "64px"
        },
        [`&${expansion.panel}`]: {
          background: theme.background.secondary,
          "&::after": {
            borderBefore: `2px solid ${theme.primary.default}`
          }
        },
        [`${expansion.panelHeader} ${expansion.panelTitle}`]: {
          color: theme.primary.default
        }
      }
    }
  };
};

const thmstyles = {
  photoProfile: {
    height: "100px",
    background: "url('../../assets/img/bg-profile.jpg') no-repeat",
    borderBottom: "3px solid #fff",
    backgroundSize: "cover"
  },
  errMsg: {
    color: "red",
    fontWeight: "bold",
    marginTop: "20px",
    textAlign: "center"
  },
  button: {
    width: "100%",
    marginBottom: "15px",
    height: "45px"
  },
  labelAfter: {
    paddingBefore: "8px"
  },
  adminFloat: {
    position: "absolute",
    bottom: "5px",
    right: "25px"
  }
};

const STYLES_DIALOG = (theme: ThemeVariables) => ({
  width: "700px",
  borderRadius: 0,
  [theme.getBreakpoint("XSmall")]: {
    width: "100vw",
    height: "100vh",
    maxWidth: "100vw !important",
    maxHeight: "100vh !important"
  }
});
@Component({
  selector: "app-profil-main",
  templateUrl: "./profil-main.component.html",
  styleUrls: ["./profil-main.component.scss"],
  providers: [NgxImageCompressService]
})
export class ProfilMainComponent implements OnInit, AfterViewInit {
  readonly classes = this.theme.addStyleSheet(thmstyles);
  readonly classesEx = this.theme.addStyleSheet(STYLES);
  @ViewChild("fileInput", { static: false }) fileInput: ElementRef;
  panelStates = [{ state: false }, { state: true }, { state: false }];
  credential: any;
  config: any;
  currentQuickProfile: any;
  currentEmployee: any;
  profilePhoto = "";
  groupInfo = [];
  loadImage = false;

  constructor(
    private stateService: StateService,
    private imageCompress: NgxImageCompressService,
    private theme: LyTheme2,
    private employeeService: EmployeeService,
    private accountService: AccountService,
    private masterService: MasterService,
    private _dialog: LyDialog,
    private route: ActivatedRoute
  ) {
    this.stateService.currentCredential.subscribe(cr => {
      this.credential = cr;
    });
    this.config = this.stateService.getConfig();
  }

  ngOnInit() {
    if (
      (this.route.snapshot.paramMap.get("emp") &&
        this.route.snapshot.paramMap.get("emp") === this.credential.Username) ||
      this.credential.Role === "ESS_ADM"
    ) {
      this.accountService.getJSON("emp.json").subscribe(f => {
        this.fetchParameter(f, cb => {
          this.groupInfo = this.stateService.groupFunc(cb, "order");
          this.groupInfo = this.groupInfo.map(m => {
            m.state = false;
            return m;
          });
        });
      });
      this.getQuickCredential(qc => {
        this.currentQuickProfile = qc;
        if (this.currentQuickProfile.Photo) {
          this.profilePhoto =
            this.config.Api.profile +
            this.currentQuickProfile.Username +
            "/" +
            this.currentQuickProfile.Photo;
        } else {
          this.profilePhoto = this.stateService.getDefaultPhoto();
        }
      });

      this.bindData(qc => {
        this.currentEmployee = qc;
      });
    } else {
    }
  }

  ngAfterViewInit() {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("assets/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("assets/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("assets/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("assets/models")
    ]);
  }

  fetchParameter(fields, callback) {
    this.stateService.setBlocking(1);
    let master = forkJoin(
      this.masterService.getArea({ Levels: 1 }),
      this.masterService.getArea({ Levels: 2 }),
      this.masterService.getEnum({}),
      this.masterService.getDivision({}),
      this.masterService.getTitle({}),
      this.employeeService.getEmployeeQuickProfileSimple({})
    );
    master.subscribe(res => {
      fields.find(f => f.key === "AreaCodeKtp").option = res[1].map(m => {
        m.ParentDescription = res[0].find(
          f => f.AreaCode === m.ParentAreaCode
        ).Description;
        m.text =
          m.Description +
          " - " +
          res[0].find(f => f.AreaCode === m.ParentAreaCode).Description;
        m.value = m.AreaCode;
        return m;
      });
      fields.find(f => f.key === "AreaCodeDomisile").option = res[1].map(m => {
        m.ParentDescription = res[0].find(
          f => f.AreaCode === m.ParentAreaCode
        ).Description;
        m.text =
          m.Description +
          " - " +
          res[0].find(f => f.AreaCode === m.ParentAreaCode).Description;
        m.value = m.AreaCode;
        return m;
      });

      fields.find(f => f.key === "Religion").option = res[2]
        .filter(f => f.Code === "AGM")
        .map(m => {
          m.text = m.Text;
          m.value = m.Value;
          return m;
        });
      fields.find(f => f.key === "FamilyTax").option = res[2]
        .filter(f => f.Code === "TAX")
        .map(m => {
          m.text = m.Text;
          m.value = m.Value;
          return m;
        });
      fields.find(f => f.key === "DivisionID").option = res[3]
        ? res[3].map(m => {
            (m.text = m.Name), (m.value = m.Id);
            return m;
          })
        : [];
      //get child of division
      let Departments = [];
      res[3].map(m => {
        Departments.push(...m.Departments);
      });
      fields.find(f => f.key === "DepartmentID").option = res[3]
        ? Departments.map(m => {
            (m.text = m.Name), (m.value = m.Id);
            return m;
          })
        : [];
      //end get
      fields.find(f => f.key === "OrganizationLevelID").option = res[4]
        ? res[4].map(m => {
            (m.text = m.Name), (m.value = m.Id);
            return m;
          })
        : [];
      fields.find(f => f.key === "DirectReportID").option = res[5]
        ? res[5]
            .map(m => {
              (m.text = "(" + m.Username + ") " + m.FullName),
                (m.value = m.EmployeeId);
              return m;
            })
            .filter(f => f.EmployeeId != this.currentQuickProfile.EmployeeID)
        : [];

      if (res[0] && res[1] && res[2] && res[3] && res[4] && res[5]) {
        this.stateService.setBlocking(0);
        callback(fields);
      }
    });
  }

  getQuickCredential(callback) {
    if (this.route.snapshot.paramMap.get("emp")) {
      let emp = this.route.snapshot.paramMap.get("emp");
      this.employeeService
        .getEmployeeQuickProfile({ Username: emp }, null)
        .subscribe(qc => {
          if (qc.length) {
            callback(qc[0]);
          } else {
            callback(null);
          }
        });
    } else {
      callback(null);
    }
  }

  bindData(callback) {
    //adding checking role
    if (this.route.snapshot.paramMap.get("emp")) {
      this.stateService.setBlocking(1);
      let emp = this.route.snapshot.paramMap.get("emp");
      this.employeeService.getEmployee({ NRP: emp }).subscribe(prof => {
        if (prof.length) {
          prof = prof.map(m => {
            m.ClockOut = moment(m.ClockOut)
              .utc()
              .format("YYYY-MM-DD HH:mm");
            m.ClockIn = moment(m.ClockIn)
              .utc()
              .format("YYYY-MM-DD HH:mm");
            return m;
          });
          this.stateService.setBlocking(0);
          callback(prof[0]);
        } else {
          this.stateService.setBlocking(0);
          callback(null);
        }
      });
    } else {
      callback(null);
    }
  }

  readUrlImg(event: any) {
    this.loadImage = true;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      let fakeUrl;
      let fakeFile = event.target.files[0];
      reader.onload = async (event: any) => {
        fakeUrl = event.target.result;
        let faceImg = await faceapi.fetchImage(fakeUrl);

        const detections = await faceapi.detectAllFaces(
          faceImg,
          new faceapi.TinyFaceDetectorOptions()
        );
        if (detections.length === 0) {
          this.showAlert("Wajah tidak terdeteksi, silahkan upload kembali!", false);
          return;
        }
        /* const faceImages = await faceapi.extractFaces(faceImg, detections);
        if (faceImages.length > 0) {
          fakeUrl = faceImages[0].toDataURL();
        } */
        setTimeout(() => {
          this.imageCompress.compressFile(fakeUrl, 1, 50, 50).then(result => {
            this.changePP(
              this.stateService.dataURLtoFile(result, fakeFile.name),
              this.currentQuickProfile.Username,
              up => {
                if (up) {
                  let objPut = {
                    Photo: up.filename,
                    Id: this.currentEmployee.Id
                  };
                  this.employeeService.putEmployee(objPut).subscribe(put => {
                    if (put.length) {
                      this.deleteFile(
                        this.currentQuickProfile.Username,
                        this.currentQuickProfile.Photo,
                        del => {
                          // console.log(del);
                        }
                      );
                      this.getQuickCredential(prof => {
                        if (prof) {
                          if (prof.Username === this.credential.Username) {
                            //same person update localstorage
                            this.credential.quickProfile = prof;
                            this.stateService.setProfilePic(
                              this.config.Api.profile +
                                prof.Username +
                                "/" +
                                up.filename
                            );
                            this.stateService.setCredential(this.credential);
                          }
                          this.profilePhoto =
                            this.config.Api.profile +
                            prof.Username +
                            "/" +
                            prof.Photo;
                          this.loadImage = false;
                        }
                      });
                    }
                  });
                }
              }
            );
          });
          this.fileInput.nativeElement.value = "";
        }, 700);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  showSection(section) {
    const dialogRefInfo = this._dialog.open<ProfilMainFieldComponent>(
      ProfilMainFieldComponent,
      {
        containerClass: this.theme.style(STYLES_DIALOG),
        data: {
          NRP: this.currentEmployee.NRP,
          EmployeeID: this.currentEmployee.Id,
          objectData: section,
          fieldInput: this.groupInfo.find(f => f.key === section).value,
          files: [
            ...this.currentEmployee.EmployeeAttachmentTemps,
            ...this.currentEmployee.EmployeeAttachments
          ],
          data: this.filterObjectProp(
            this.groupInfo.find(f => f.key === section).value,
            this.currentEmployee
          )
        }
      }
    );
    dialogRefInfo.afterClosed.subscribe(res => {
      if (res == 1) {
        this.showAlert(
          "Perubahan berhasil disimpan, menunggu approval HC",
          false
        );
        this.bindData(qc => {
          this.currentEmployee = qc;
        });
      }
    });
  }

  showPopUp(params) {
    this.stateService.setBlocking(1);
    this.accountService.getJSON(params + ".json").subscribe(ed => {
      if (ed.length && this.currentEmployee) {
        let objDialog;
        switch (params) {
          case "edu":
            objDialog = this.objDialogBuilder(
              "Pendidikan",
              this.currentEmployee.NRP,
              this.currentEmployee.Id,
              ["Degree", "Institution"],
              ed,
              this.currentEmployee.EmployeeEduTemps,
              this.currentEmployee.EmployeeEdus,
              this.currentEmployee.EmployeeAttachmentTemps,
              this.currentEmployee.EmployeeAttachments
            );
            break;
          case "trn":
            objDialog = this.objDialogBuilder(
              "Pelatihan",
              this.currentEmployee.NRP,
              this.currentEmployee.Id,
              ["Institution", "Description"],
              ed,
              this.currentEmployee.EmployeeTrainingTemps,
              this.currentEmployee.EmployeeTrainings,
              this.currentEmployee.EmployeeAttachmentTemps,
              this.currentEmployee.EmployeeAttachments
            );
            break;
          case "fam":
            objDialog = this.objDialogBuilder(
              "Keluarga",
              this.currentEmployee.NRP,
              this.currentEmployee.Id,
              ["Relation", "FullName"],
              ed,
              this.currentEmployee.EmployeeFamilyTemps,
              this.currentEmployee.EmployeeFamilies,
              this.currentEmployee.EmployeeAttachmentTemps,
              this.currentEmployee.EmployeeAttachments
            );
            break;
        }
        this.stateService.setBlocking(0);
        const dialogRefInfo = this._dialog.open<ProfileItemsComponent>(
          ProfileItemsComponent,
          {
            containerClass: this.theme.style(STYLES_DIALOG),
            data: objDialog
          }
        );
        dialogRefInfo.afterClosed.subscribe(res => {
          this.ngOnInit();
        });
      } else {
        this.stateService.setBlocking(0);
      }
    });
  }

  filterObjectProp(prop, object) {
    let myObj = {};
    prop.forEach(el => {
      myObj[el.key] = object[el.key];
    });
    return myObj;
  }

  objDialogBuilder(
    objectData,
    username,
    empID,
    col,
    fieldInput,
    dataTemp,
    data,
    attachmentTemp,
    attachment
  ) {
    return {
      objectData: objectData,
      username: username,
      fieldInput: fieldInput,
      col: col,
      dataTemp: dataTemp,
      data: data,
      attachmentTemp: attachmentTemp,
      attachment: attachment,
      empID: empID
    };
  }

  changePP(file, nrp, callback) {
    this.employeeService.postUpload(file, "image", nrp).subscribe(
      event => {
        let eventRes: any;
        if (event.type === HttpEventType.UploadProgress) {
          // this.progressPercent = Math.round(100 * event.loaded / event.total);
          // console.log(this.progressPercent);
        }
        if (event instanceof HttpResponse) {
          eventRes = event.body;
          callback(eventRes);
        }
      },
      errUpload => {
        console.error(errUpload);
        this.showAlert(
          "<b>Upload foto profil gagal, mohon cek jaringan Anda</b>",
          true
        );
      }
    );
  }

  deleteFile(nrp, filename, callback) {
    this.employeeService.deleteFileProfile(nrp, filename).subscribe(del => {
      if (del) {
        callback(1);
      } else {
        callback(0);
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
    dialogRefInfo.afterClosed.subscribe(() => {});
  }
}
