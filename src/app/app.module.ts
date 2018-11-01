import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BatteryLevelService } from './battery-level.service'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebBluetoothModule } from '@manekinekko/angular-web-bluetooth';
import { BatteryLevelComponent } from './battery-level/battery-level.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
//Comment

@NgModule({
  declarations: [
    AppComponent,
    BatteryLevelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    WebBluetoothModule.forRoot({
      enableTracing: true
    }),
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [BatteryLevelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
