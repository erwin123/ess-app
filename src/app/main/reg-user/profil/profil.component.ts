import { Component, OnInit } from '@angular/core';
import { LyTheme2, shadowBuilder, ThemeVariables } from '@alyle/ui';
const thmstyles = (theme: ThemeVariables) => ({
  container: {
    maxWidth: '100%'
  },
  item: {
    padding: '16px',
    textAlign: 'center',
    background: theme.background.secondary,
    boxShadow: shadowBuilder(1),
    borderRadius: '4px',
    height: '100%'
  },
  switch: {
    border: 'solid #34eb43 1px',
    borderRadius: '5px',
    width: '146px'
  },
  errMsg: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: '20px',
    textAlign: 'center'
  }
});
@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(thmstyles);
  constructor(private theme: LyTheme2) { }

  ngOnInit() {
  }

}
