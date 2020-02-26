import { Component, OnInit } from "@angular/core";
import { MasterService } from "src/app/services/master.service";
import { Router } from "@angular/router";
import { StateService } from "src/app/services/state.service";

@Component({
  selector: "app-maintain-work-location",
  templateUrl: "./maintain-work-location.component.html",
  styleUrls: ["./maintain-work-location.component.scss"]
})
export class MaintainWorkLocationComponent implements OnInit {
  data = [];
  columns = [
    { key: "WorkLocationName", title: "Nama" },
    { key: "WorkLocationAddress", title: "Alamat" },
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
    this.masterService.getWorkLocation({}).subscribe(loc => {
      this.data = loc;
      this.stateService.setBlocking(0);
    });
  }

  receiveEvent(data) {
    this.router.navigate(["main/admin/set-work-location/"], {
      queryParams: {
        id: data.Id,
        mode: 1
      }
    });
  }

  receiveAddEvent(data) {
    this.router.navigate(["main/admin/set-work-location/"]);
  }
}
