import { Component, OnInit, ViewChild, Input, Output,EventEmitter } from '@angular/core';
import { API, APIDefinition } from 'ngx-easy-table';
import { LyTheme2, ThemeVariables } from '@alyle/ui';

const STYLES = (_theme: ThemeVariables) => ({
  container: {
    maxWidth: '100%',
    margin: '10px 10px 10px 10px'
  },
  header: {
    padding: '15px 0px 0px 10px'
  },
  table: {
    fontSize: '14px'
  }
});
@Component({
  selector: 'app-maintain-tpl',
  templateUrl: './maintain-tpl.component.html',
  styleUrls: ['./maintain-tpl.component.scss']
})

export class MaintainTplComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(STYLES);
  @ViewChild('table', { static: false }) table: APIDefinition;
  @Input('columns') columns = [];
  @Input('data') data = [];
  @Input('objectData') objectData;
  @Output() actionClickEvent = new EventEmitter<any>();
  @Output() actionAddEvent = new EventEmitter<number>();

  constructor(private theme: LyTheme2) { }

  ngOnInit() {
  }
  onChange($event): void {
    if ($event.target.value) {
      this.table.apiEvent({
        type: API.onGlobalSearch, value: $event.target.value,
      });
    }
  }
  sendAction($event) {
    if($event.value.row)
      this.actionClickEvent.emit($event.value.row);
  }
  sendAdd(){
    this.actionAddEvent.emit(1);
  }
}
