import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { AccountService } from '../services/account.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { LyTheme2 } from '@alyle/ui';
import { trigger, animate, style, group, query, transition } from '@angular/animations';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { StateService } from '../services/state.service';
import { Router } from '@angular/router';
import * as SecureLS from 'secure-ls';

const STYLES = ({
  drawerContainer: {
    height: 'calc(100vh - 64px)',
    transform: 'translate3d(0,0,0)'
  },
  drawerContentArea: {
    padding: '1%',
    height: '100%',
    overflow: 'auto'
  },
  icon: {
    margin: '0 8px'
  },
  iconSize: {
    fontSize: "20px"
  },
  grow: {
    flex: 1
  }
});

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [
    trigger('routerTransition', [
      transition('* => feed', [
        query(':enter, :leave', style({ position: 'fixed', width: '100%' })
          , { optional: true }),
        group([
          query(':enter', [
            style({ transform: 'translateX(-100%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' }))
          ], { optional: true }),
        ])
      ]),
      transition('feed => *', [
        group([
          query(':enter, :leave', style({ position: 'fixed', width: '100%' })
            , { optional: true }),
          query(':enter', [
            style({ transform: 'translateX(100%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' }))
          ], { optional: true }),
        ])
      ]),
      transition('* => progress', [
        group([
          query(':enter, :leave', style({ position: 'fixed', width: '100%' })
            , { optional: true }),
          query(':enter', [
            style({ transform: 'translateX(100%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' }))
          ], { optional: true }),
        ])
      ]),
      transition('progress => baseticket', [
        query(':enter, :leave', style({ position: 'fixed', width: '100%' })
          , { optional: true }),
        group([
          query(':enter', [
            style({ transform: 'translateX(-100%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' }))
          ], { optional: true }),
        ])
      ])
    ])
  ]
})
export class MainComponent implements OnInit {
  @ViewChild('drwMain', { static: false }) drwMain: any;
  menus = [];
  sidemenus = [];
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  readonly classes = this._theme.addStyleSheet(STYLES);
  title = "";
  subtitle = "";
  nodes = [];
  options = {};
  @BlockUI() blockUI: NgBlockUI;
  ls = new SecureLS();
  credential: any;
  profilePhoto = "";
  config: any;
  constructor(private _theme: LyTheme2, changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher, private accService: AccountService,
    private stateService: StateService, private router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.stateService.currentCredential.subscribe(cr => {
      this.credential = cr;
    })

    this.config = this.stateService.getConfig();
    //this.profilePhoto = this.config.Api.profile + "person-icon.png";
  }

  ngOnInit() {
    this.stateService.currentProfilePic.subscribe(pp => {
      this.profilePhoto = pp;
      console.log(pp);
    })
    this.stateService.currentBlocking.subscribe(b => {
      if (b == 1) {
        this.blockUI.start('Loading...');
      }
      else {
        this.blockUI.stop();
      }
    })
    this.accService.getJSON("main-menu.json").subscribe(res => {
      this.menus = res;
    })
    this.accService.getJSON("side-menu.json").subscribe(res => {
      this.sidemenus = res;
    });
    this.accService.getJSON("left-menu.json").subscribe(res => {
      this.nodes = res;
    });
    console.log(this.credential);
    if (this.credential.quickProfile.Photo)
      this.profilePhoto = this.config.Api.profile + this.credential.quickProfile.Username + "/" + this.credential.quickProfile.Photo;
  }

  goTo(path, title) {
    if (path) {
      if (this.mobileQuery.matches && this.drwMain._isOpen) {
        this.drwMain.toggle();
      }
      if (title === "Profil") {
        this.router.navigate([path + "/" + this.credential.Username]);
      } else if (title === "Logout") {
        this.stateService.logout();
      }
      else {
        this.router.navigate([path]);
      }

    }
  }
}
