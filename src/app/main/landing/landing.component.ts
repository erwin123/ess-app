import { Component, OnInit } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';
import { AccountService } from 'src/app/services/account.service';
import { Router } from '@angular/router';
import { StateService } from 'src/app/services/state.service';

const STYLES = {
  paper: {
    display: 'block',
    position: 'relative',
    margin: '.2em',
    cursor: 'pointer',
    overflow: 'hidden',
    userSelect: 'none',
    height: '85px',
    borderRadius: '8px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #283271 0%, #066f85 100%, #020024 283271%)'
  },
  texting: {
    fontSize: '14px',
    color: '#fff',
    marginTop: '3px'
  },
  icon: {
    marginTop: '10px'
  },
  carousel: {
    maxWidth: '100%',
    height: '300px',
    margin: 'auto'
  },
  carouselItem: {
    textAlign: 'center',
    fontSize: '16px',
    paddingTop: '5px',
    fontWeight: 'bold',
    textShadow: '0 0 10px #fff'
  }
};
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})


export class LandingComponent implements OnInit {
  readonly classes = this._theme.addStyleSheet(STYLES);
  menus = [];
  car = [];
  credential;
  config;
  constructor(private _theme: LyTheme2, private accountService: AccountService,
    private router: Router, private stateService:StateService) {
    this.stateService.currentCredential.subscribe(cr => {
      this.credential = cr;
    })

    this.config = this.stateService.getConfig();
  }

  ngOnInit() {
    this.accountService.getJSON("landing-menu.json").subscribe(res => {
      this.menus = res.map(m => {
        if (m.Role.indexOf(this.credential.Role) != -1) {
          return m
        }
      }).filter(f => f != null);
    })
    this.accountService.getJSON("carousel.json").subscribe(res => {
      this.car = res
    })
  }

  goTo(path) {
    this.router.navigate([path]);
  }
}
