import { Component, OnInit } from '@angular/core';
import { LyTheme2, ThemeVariables } from '@alyle/ui';
import { SwUpdate } from '@angular/service-worker';

const STYLES = (theme: ThemeVariables) => ({
  '@global': {
    body: {
      backgroundColor: theme.background.default,
      color: theme.text.default,
      fontFamily: theme.typography.fontFamily,
      margin: 0,
      direction: theme.direction
    }
  }
});

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(STYLES);

  title = 'ACST - ESS';

  constructor(private theme: LyTheme2, private swUpdate: SwUpdate) { }
  ngOnInit() {
    if (this.swUpdate.isEnabled) {

      this.swUpdate.available.subscribe(() => {

        if (confirm("Versi terbaru tersedia, muat ulang konten?")) {

          window.location.reload(true);
        }
      });
    }
  }
}
