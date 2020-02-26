import { Component, OnInit } from "@angular/core";
import { MasterService } from "src/app/services/master.service";
import { Router } from "@angular/router";
import { StateService } from "src/app/services/state.service";

@Component({
  selector: "app-maintain-shift",
  templateUrl: "./maintain-shift.component.html",
  styleUrls: ["./maintain-shift.component.scss"]
})
export class MaintainShiftComponent implements OnInit {
  data = [];
  columns = [
    { key: "ShiftCode", title: "Shife Code" },
    { key: "ShiftName", title: "ShiftName" },
    { key: "RowStatus", title: "Aktif" }
  ];
  constructor(
    private masterService: MasterService,
    private router: Router,
    private stateService: StateService
  ) {}

  ngOnInit() {
    this.fetchData();
  }
  fetchData() {
    this.stateService.setBlocking(1);
    this.masterService.getShift().subscribe(loc => {
      this.data = loc;
      this.stateService.setBlocking(0);
    });
  }
  receiveEvent(data) {
    //console.log(data);
    this.router.navigate(["main/admin/set-master-shift/"], {
      queryParams: {
        Id: data.Id,
        mode: 1
      }
    });
  }
  receiveAddEvent(data) {
    //console.log(data);
    this.router.navigate(["main/admin/set-master-shift/"]);
  }
}
