import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/services/master.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-maintain-location',
  templateUrl: './maintain-location.component.html',
  styleUrls: ['./maintain-location.component.scss']
})

export class MaintainLocationComponent implements OnInit {
  data=[];
  columns = [
    { key: 'LocationName', title: 'Nama' },
    { key: 'LocationAddress', title: 'Alamat' },
    { key: 'RowStatus', title: 'Aktif' }
  ];
  constructor(private masterService:MasterService, private router:Router) { }

  ngOnInit() {
    this.fetchData();
  }
  fetchData() {
    this.masterService.getLocation({}).subscribe(loc => {
      this.data = loc;
    });
  }
  receiveEvent(data){
    //console.log(data);
    this.router.navigate(['main/admin/set-location/'],
    {
      queryParams: {
        id: data.Id,
        mode: 1
      }
    });
  }
  receiveAddEvent(data){
    //console.log(data);
    this.router.navigate(['main/admin/set-location/']);
  }

}
