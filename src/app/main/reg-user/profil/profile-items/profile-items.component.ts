import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { LyTheme2, ThemeVariables } from '@alyle/ui';
import { LyDialogRef, LY_DIALOG_DATA, LyDialog } from '@alyle/ui/dialog';
import { DialogInfoComponent } from 'src/app/alert/dialog-info/dialog-info.component';
import * as async from 'async';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { EmployeeService } from 'src/app/services/employee.service';
import * as moment from 'moment';
import { StateService } from 'src/app/services/state.service';
const STYLES = (_theme: ThemeVariables) => ({
  container: {
    maxWidth: '100%',
    margin: '10px 10px 10px 10px'
  },
  header: {
    padding: '15px 0px 0px 10px'
  },
  button: {
    width: '100%'

  },
  btnWrapper: {
    display: 'block',
    width: '100%',
    marginBottom: '25px',
    marginTop: '50px'
  },
  uploadBtnFile: {
    opacity: '0',
    position: 'absolute',
    left: '0', top: '0'
  },
  customBadge: {
    after: 0,
    above: 0,
    bottom: 0,
    margin: 'auto 0',
    border: `2px solid ${_theme.background.tertiary}`
  },
  adminFloat: {
    position: 'absolute',
    bottom: '5px',
    right: '25px'
  }
});
@Component({
  selector: 'app-profile-items',
  templateUrl: './profile-items.component.html',
  styleUrls: ['./profile-items.component.scss']
})
export class ProfileItemsComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(STYLES);
  title = "";
  columns = [];
  data = [];
  dataTemp = [];
  fields = [];
  parser;
  addRow = false;
  dataEdit;
  files = [];
  message = '';
  username;
  EmpID = 0;
  attachmentTemp = [];
  attachment = [];
  url = '';
  config: any;
  credential: any;
  isTemp = true;
  constructor(@Inject(LY_DIALOG_DATA) public dataParser: any, private _dialog: LyDialog,
    private cdRef: ChangeDetectorRef, public dialog: LyDialogRef, private theme: LyTheme2,
    private employeeService: EmployeeService, private stateService: StateService) {
    this.parser = dataParser;
    this.config = this.stateService.getConfig();
    this.stateService.currentCredential.subscribe(cr => {
      this.credential = cr;
    });
  }

  ngOnInit() {
    this.title = this.parser.objectData;
    this.data = this.parser.data;
    this.dataTemp = this.parser.dataTemp;
    this.columns = this.parser.col;
    this.fields = this.parser.fieldInput;
    this.username = this.parser.username;
    this.EmpID = this.parser.empID;
    this.attachment = this.parser.attachment.filter(f => f.AttachmentType === this.title);
    this.attachmentTemp = this.parser.attachmentTemp.filter(f => f.AttachmentType === this.title);
    if (this.attachmentTemp.length) {
      this.files = this.attachmentTemp.map(m => {
        return {
          filename: m.Filename,
          name: m.Systemname,
          url: this.config.Api.profile + this.username + "/" + m.Filename,
          isRealUrl: true
        }
      })
    }
  }

  addedRow($event) {
    if ($event) {
      this.addRow = false;
      this.dataTemp.push($event);
    }
  }

  showAlert(data, callback) {
    const dialogRefInfo = this._dialog.open<DialogInfoComponent>(DialogInfoComponent, {
      data: data
    });
    dialogRefInfo.afterClosed.subscribe((res) => {
      callback(res);
    });
  }

  readFile(event: any) {
    this.message = "";
    if (event.target.files && event.target.files[0]) {
      for (let i = 0; i < event.target.files.length; i++) {
        if (event.target.files[i].size <= 1000000) { this.files.push(event.target.files[i]); }
        else {
          this.message = "Salah satu atau lebih file lebih besar dari 1MB";
        }
      }
    }
  }

  windowOpenDataUrl(file) {
    if (file.url) {
      this.downloadFile(file.url, file.name);
    } else {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.downloadFile(e.target.result, file.name);
      }
      reader.readAsDataURL(file);
    }
  }

  downloadFile(url, filename) {
    this.employeeService.downloadFile(url).subscribe(bl => {
      var a = document.createElement("a");
      a.href = URL.createObjectURL(bl);
      a.download = filename;
      a.click();
      this.showAlert({
        MessageTitle: "Informasi",
        Message: "Download berhasil",
        err: false,
        ConfirmationMode: false
      }, cb => {
      })
    })
  }

  deleteFile(file) {
    this.message = "";
    this.showAlert({
      MessageTitle: "Konfirmasi Hapus",
      Message: "Anda yakin ingin hapus?",
      err: false,
      ConfirmationMode: true
    }, cb => {
      if (cb == 1) {
        if (file.filename) { //real sudah di db
          this.employeeService.putEmployeeAttachTemp({ Filename: file.filename, RowStatus: 0 }).subscribe(up => {
            if (up.length) {
              this.files.splice(this.files.findIndex(f => f.name === file.name), 1);
              this.cdRef.detectChanges();
            }
          });
        } else {
          this.files.splice(this.files.findIndex(f => f.name === file.name), 1);
          this.cdRef.detectChanges();
        }
      }
    })
  }

  editedRow($event) {
    this.dataEdit = undefined;
    if ($event.RowStatus == 0) {
      this.dataTemp.splice(this.dataTemp.findIndex(i => i.Id == $event.Id), 1);
    } else {
      this.dataTemp.splice(this.dataTemp.findIndex(i => i.Id == $event.Id), 1, $event);
    }
    this.addRow = false;
  }
  
  cancelRow($event) {
    this.dataEdit = undefined;
    this.addRow = false;
  }

  closeDialog() {
    this.dialog.close(this.dataTemp);
  }

  showData(obj, isTemp) {
    if (!this.addRow) {
      this.dataEdit = obj;
      this.isTemp = isTemp;
      this.addRow = true;
    } else {
      this.cancelRow(null);
    }
  }

  onAction(isApprove) {
    this.stateService.setBlocking(1);
    if (isApprove) {
      switch (this.title) {
        case "Keluarga":
          this.employeeService.approveEmployee("fam", this.username).subscribe(res => {
            if (res.message) {
              this.stateService.setBlocking(0);
              this.dialog.close();
            }
          })
          break;
        case "Pelatihan":
          this.employeeService.approveEmployee("trn", this.username).subscribe(res => {
            if (res.message) {
              this.stateService.setBlocking(0);
              this.dialog.close();
            }
          })
          break;
        case "Pendidikan":
          this.employeeService.approveEmployee("edu", this.username).subscribe(res => {
            if (res.message) {
              this.stateService.setBlocking(0);
              this.dialog.close();
            }
          })
          break;
      }
    } else {
      switch (this.title) {
        case "Keluarga":
          this.employeeService.rejectEmployee("fam", this.username).subscribe(res => {
            if (res.message) {
              this.stateService.setBlocking(0);
              this.dialog.close();
            }
          })
          break;
        case "Pelatihan":
          this.employeeService.rejectEmployee("trn", this.username).subscribe(res => {
            if (res.message) {
              this.stateService.setBlocking(0);
              this.dialog.close();
            }
          })
          break;
        case "Pendidikan":
          this.employeeService.rejectEmployee("edu", this.username).subscribe(res => {
            if (res.message) {
              this.stateService.setBlocking(0);
              this.dialog.close();
            }
          })
          break;
      }
    }
  }

  uploadFile() {
    if (this.files.length > 0) {
      this.stateService.setBlocking(1);
      let resultUpload = [];
      async.every(this.files, (each, callback) => {
        if (each !== null && !each.isRealUrl) {
          this.employeeService.postUpload(each, "attach", this.username).subscribe(event => {
            let eventRes: any;
            if (event.type === HttpEventType.UploadProgress) {
              const percentDone = Math.round(100 * event.loaded / event.total);
              console.log(percentDone);
            }
            if (event instanceof HttpResponse) {
              eventRes = event.body;
              resultUpload.push(eventRes)
              callback(null, true);
            }
          }, err => {
            callback(null, false);
          });
        } else {
          callback(null, true);
        }
      }, (err, result) => {
        if (result) {
          async.every(resultUpload.map(m => {
            return {
              RowStatus: 1,
              AttachmentType: this.title,
              Filename: m.filename,
              Systemname: m.systemname,
              EmployeeID: this.EmpID
            }
          }), (each, callback) => {
            this.employeeService.postEmployeeAttachTemp(each).subscribe(resUpload => {
              if (resUpload) {
                callback(null, true)
              }
              else {
                callback(null, false)
              }

            })
          }, (err, result) => {
            this.stateService.setBlocking(0);
            this.showAlert({
              MessageTitle: "Informasi",
              Message: "Dokumen berhasil diupload",
              err: false,
              ConfirmationMode: false
            }, cb => {
              this.dialog.close();
            })
          })

        }
      });
    }
  }

}
