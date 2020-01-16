import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LyThemeModule, LY_THEME, LyCommonModule, PartialThemeVariables } from '@alyle/ui';
import { MinimaLight } from '@alyle/ui/themes/minima';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { LandingComponent } from './main/landing/landing.component';
import { SharingModuleModule } from './sharing-module/sharing-module.module';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AuthguardService } from './services/authguard.service';
import { HttpClientModule } from '@angular/common/http';
import { AppConfig, InitConfig } from './app-config';
import { BlockUIModule } from 'ng-block-ui';
//import { TreeModule } from 'angular-tree-component';
import { InboxComponent } from './main/inbox/inbox.component';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!

export class CustomMinimaLight implements PartialThemeVariables {
  name = 'minima-light';
  primary = {
    default: '#203072',
    contrast: '#eeeeee'
  };
  accent = {
    default: '#A32100',
    contrast: '#eeeeee'
  };
  grind = {
    default: '#34eb43',
    contrast: '#eeeeee'
  };
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    LandingComponent,
    InboxComponent
  ],
  imports: [
    BrowserModule,
    SharingModuleModule,
    LyCommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LyThemeModule.setTheme('minima-light'),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BlockUIModule.forRoot(),
    //TreeModule.forRoot(),
    FullCalendarModule 
  ],
  providers: [
    AuthguardService, AppConfig,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: APP_INITIALIZER, useFactory: InitConfig, deps: [AppConfig], multi: true },
    { provide: LY_THEME, useClass: MinimaLight, multi: true },
    { provide: LY_THEME, useClass: CustomMinimaLight, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
