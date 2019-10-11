import { Component, OnInit } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';
import { AccountService } from 'src/app/services/account.service';
import { Router } from '@angular/router';

const STYLES = {
  paper: {
    display: 'block',
    position: 'relative',
    margin: '.2em',
    cursor: 'pointer',
    overflow: 'hidden',
    userSelect: 'none',
    height:'125px',
    borderRadius:'3px'
  },
  img:{
    width:'100%',
    height:'100%',
    objectFit:'cover',
    position:'absolute'
  },
  overlay:{
    background:'linear-gradient(to left, rgba(0,0,0,0.65) 0%,rgba(0,0,0,0) 100%);',
    width:'100%',
    height:'100%',
    position:'absolute'
  },
  texting:{
    fontSize:'22px',
    fontWeight:'bold',
    textShadow: '0px 0px 3px rgba(0, 0, 0, 1)',
    position:'absolute',
    padding:'20px',
    bottom:'0',
    right:'0',
    color:'#fff',
  }
};
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})


export class LandingComponent implements OnInit {
  readonly classes = this._theme.addStyleSheet(STYLES);
  menus=[];
  constructor(private _theme: LyTheme2, private accountService:AccountService,private router: Router) { }

  ngOnInit() {
    this.accountService.getJSON("landing-menu.json").subscribe(res => {
      this.menus = res
    })
  }

  goTo(path) {
    this.router.navigate([path]);
  }
}
