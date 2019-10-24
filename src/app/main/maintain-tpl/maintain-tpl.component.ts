import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
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
  @ViewChild('table2', { static: false }) table2: APIDefinition;

  @Input('columns') columns = [];
  @Input('addButton') addButton = true;
  @Input('data') data = [];
  @Input('objectData') objectData;
  @Input('isAdvanced') isAdvanced = false;

  @Output() actionClickEvent = new EventEmitter<any>();
  @Output() actionAddEvent = new EventEmitter<number>();
  @Output() actionDeleteEvent = new EventEmitter<any>();
  public toggledRows = new Set<number>();
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
    console.log($event);
    if ($event.value.row)
      this.actionClickEvent.emit($event.value.row);
  }

  sendAdd() {
    this.actionAddEvent.emit(1);
  }

  deleteAction($event,data){
    this.actionDeleteEvent.emit(data);
    $event.stopPropagation();
  }
}
