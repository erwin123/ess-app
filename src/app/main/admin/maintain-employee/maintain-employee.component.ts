import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { EmployeeService } from "src/app/services/employee.service";
import { StateService } from "src/app/services/state.service";
import { ExcelService } from "src/app/services/excel.service";
@Component({
  selector: "app-maintain-employee",
  templateUrl: "./maintain-employee.component.html",
  styleUrls: ["./maintain-employee.component.scss"]
})
export class MaintainEmployeeComponent implements OnInit {
  data = [];
  columns = [
    { key: "FullName", title: "Nama" },
    { key: "Username", title: "NRP" },
    { key: "LevelName", title: "Jabatan" },
    { key: "DepartmentName", title: "Departement" }
  ];
  tgAwal;
  tgAkhir;
  errMsg = "";
  constructor(
    private empService: EmployeeService,
    private router: Router,
    private stateService: StateService,
    private excelService: ExcelService
  ) {}
  ngOnInit() {
    //this.fetchData({},{ page: 1, pagesize: 10 });
    this.fetchData({ RowStatus: 1 }, null);
  }
  fetchData(crit, paging) {
    this.stateService.setBlocking(1);
    this.empService.getEmployeeQuickProfile(crit, paging).subscribe(emp => {
      this.data = emp;
      this.stateService.setBlocking(0);
    });
  }
  receiveEvent(data) {
    this.router.navigate(["main/admin/set-acc"], {
      queryParams: { emp: data.Username }
    });
  }
  receiveAddEvent(data) {
    //console.log(data);
    this.router.navigate(["main/admin/set-acc/"]);
  }
  receivePagingEvent(paging) {
    this.fetchData({}, paging);
  }
  receiveSearchEvent(search) {
    this.fetchData({}, {});
  }

  exportData() {
    if (this.tgAwal.isAfter(this.tgAkhir)) {
      this.errMsg = "Tanggal awal tidak boleh lebih besar tanggal akhir";
      setTimeout(() => {
        this.errMsg = "";
      }, 3000);
    } else if (this.tgAwal && this.tgAkhir) {
      this.empService
        .sapEmpProfile({ tgAwal: this.tgAwal, tgAkhir: this.tgAkhir })
        .subscribe(sap => {
          this.excelService.exportAsExcelFile(
            sap,
            "employee_profile_export_raw_" +
              new Date().toISOString().split("T")[0] +
              "_"
          );
        });
      this.empService
        .sapEmpFam({ tgAwal: this.tgAwal, tgAkhir: this.tgAkhir })
        .subscribe(sap => {
          this.excelService.exportAsExcelFile(
            sap,
            "employee_family_export_raw_" +
              new Date().toISOString().split("T")[0] +
              "_"
          );
        });
      this.empService
        .sapEmpEdu({ tgAwal: this.tgAwal, tgAkhir: this.tgAkhir })
        .subscribe(sap => {
          this.excelService.exportAsExcelFile(
            sap,
            "employee_edu_export_raw_" +
              new Date().toISOString().split("T")[0] +
              "_"
          );
        });
      this.empService
        .sapEmpTrn({ tgAwal: this.tgAwal, tgAkhir: this.tgAkhir })
        .subscribe(sap => {
          this.excelService.exportAsExcelFile(
            sap,
            "employee_training_export_raw_" +
              new Date().toISOString().split("T")[0] +
              "_"
          );
        });
    } else {
      this.errMsg = "Tanggal awal/akhir tidak valid";
      setTimeout(() => {
        this.errMsg = "";
      }, 3000);
    }
  }
}
