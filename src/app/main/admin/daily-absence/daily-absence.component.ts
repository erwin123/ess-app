import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbsentService } from 'src/app/services/absent.service';
import { StateService } from 'src/app/services/state.service';
import { LyTheme2 } from '@alyle/ui';
import { FormGroup, FormControl } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
const thmstyles = (theme) => ({
  container: {
    maxWidth: '100%'
  },
  mapContainer:{
    height:'200px !important'
  }
});
@Component({
  selector: 'app-daily-absence',
  templateUrl: './daily-absence.component.html',
  styleUrls: ['./daily-absence.component.scss']
})
export class DailyAbsenceComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(thmstyles);
  data = [];
  dataView = [];
  dataMapIn;
  dataMapOut;
  credential;
  config;
  fields;
  // absenForm: FormGroup = new FormGroup({
  //   FullName: new FormControl({ value: '', disabled: true }),
  //   AbsentDate: new FormControl({ value: '', disabled: true }),
  //   ClockIn: new FormControl({ value: '', disabled: true }),
  //   ClockOut: new FormControl({ value: '', disabled: true }),
  //   NRP: new FormControl({ value: '', disabled: true }),
  //   EmpLocName: new FormControl({ value: '', disabled: true })
  // });

  constructor(private absenService: AbsentService, private theme: LyTheme2,private accService:AccountService,
    private stateService: StateService, private router: Router, private route: ActivatedRoute) {
    this.stateService.currentCredential.subscribe(cr => {
      this.credential = cr;
    });
    this.config = this.stateService.getConfig();
  }
  ngOnInit() {
    this.route.queryParams.subscribe(p => {
      if (p.idabs) {
        this.fetchData({ Id: p.idabs });
      }
    })
  }
  fetchData(crit) {
    this.stateService.setBlocking(1);
    this.absenService.postCriteria(crit).subscribe(emp => {
      if (emp.length) {
        this.dataView = emp.map(m => {
          m.ClockIn = m.ClockIn ? m.ClockIn.split('T')[0] + " " + m.ClockIn.split('T')[1].replace('.000Z', '') : "-Belum Absen-";
          m.ClockOut = m.ClockOut ? m.ClockOut.split('T')[0] + " " + m.ClockOut.split('T')[1].replace('.000Z', '') : "-Belum Absen-";
          m.PhotoIn = m.PhotoIn ? this.config.Api.absen  + "/" + m.PhotoIn : null;
          m.PhotoOut = m.PhotoOut ?this.config.Api.absen  + "/" + m.PhotoOut:null;
          return {
            FullName: m.FullName,
            AbsentDate: m.AbsentDate,
            ClockIn: m.ClockIn,
            ClockOut: m.ClockOut,
            NRP: m.NRP,
            EmpLocName: m.EmpLocName
          };
        })[0];
        this.data = emp[0];
        this.setupMap(this.data);
        //this.stateService.resetForm(this.absenForm, this.dataView);
        this.accService.getJSON("absen-field.json").subscribe(f=>{
          this.fields =f;
        })
        this.stateService.setBlocking(0);
      }
    });
  }

  setupMap(data){
    this.dataMapIn = {
      Identity:"dataMapIn",
      LocOffice: [Number(data.EmpLong), Number(data.EmpLat)],
      RadiusOffice:Number(data.EmpRadius),
      LocUser: [Number(data.LongIn), Number(data.LatIn)]
    }
    this.dataMapOut = {
      Identity:"dataMapOut",
      LocOffice: [Number(data.EmpLong), Number(data.EmpLat)],
      RadiusOffice:Number(data.EmpRadius),
      LocUser: [Number(data.LongOut), Number(data.LatOut)]
    }
  }
}
