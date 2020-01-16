import { Component, OnInit } from '@angular/core';
import { LyDialogRef, LyDialog } from '@alyle/ui/dialog';
import { StateService } from 'src/app/services/state.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {

  constructor(private _dialog: LyDialog, public dialog: LyDialogRef,
  private employeeService: EmployeeService, private stateService: StateService) { }

  ngOnInit() {
  }
  closeDialog(){
    this.dialog.close();
  }
}
