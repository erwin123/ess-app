import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AccountService } from '../services/account.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { LyTheme2 } from '@alyle/ui';
import { trigger, animate, style, group, query, transition } from '@angular/animations';
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
  menus = [];
  sidemenus = [];
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  readonly classes = this._theme.addStyleSheet(STYLES);
  title = "";
  subtitle = "";
  constructor(private _theme: LyTheme2, changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher, private accService: AccountService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.accService.getJSON("main-menu.json").subscribe(res => {
      this.menus = res;
      console.log(this.menus);

    })
    this.accService.getJSON("side-menu.json").subscribe(res => {
      this.sidemenus = res;
      console.log(this.sidemenus);
    });
  }

  goTo(path, title) {
  }

}
