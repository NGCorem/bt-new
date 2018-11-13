import { Component, OnInit, NgZone } from '@angular/core';
import { BatteryLevelService } from '../battery-level.service';
import { BluetoothCore } from '@manekinekko/angular-web-bluetooth';
//A Coomet for fun
@Component({
  selector: 'ble-battery-level',
  template: `
  <div class='main-wrapper'>
    <mat-card class='control-card'>
      <mat-card-header>
        <mat-card-title>Controls</mat-card-title>
      </mat-card-header>
      <mat-card-content>
      <table>
          <tr><td><button mat-fab color="primary" href="#" >({{batteryLevel || 'N/A'}}%)</button><span> Battery Level</span></td></tr>
          <tr><td><mat-slide-toggle class='toggle1'>Toggle 1</mat-slide-toggle></td></tr>
          <tr><td><mat-slide-toggle class='toggle2'>Toggle 2</mat-slide-toggle></td></tr>
          <tr><td><mat-slide-toggle class='toggle3'>Toggle 3</mat-slide-toggle></td></tr>
      </table>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button class="mat-button" name="addToHome" id="addToHome" class="addToHome">
        INSTALL
        </button>
        <button mat-button class="mat-button" (click)="getBatteryLevel()">
          ADD DEVICE
        </button>
      </mat-card-actions>
    </mat-card>
  </div>
  `,
  styles: [`
    a {
      position: relative;
      color: rgba(255,255,255,1);
      text-decoration: none;
      background-color: #CD2834;
      font-family: monospace;
      font-weight: 700;
      font-size: 3em;
      display: block;
      padding: 4px;
      border-radius: 8px;
      box-shadow: 0px 9px 0px #B52231, 0px 9px 25px rgba(0,0,0,.7);
      margin: 100px auto;
      width: 410px;
      text-align: center;
      transition: all .1s ease;
    }
    a:active {
      box-shadow: 0px 3px 0px rgba(219,31,5,1), 0px 3px 6px rgba(0,0,0,.9);
      position: relative;
      top: 6px;
    }
    .control-card {
      position: relative;
      left: 33%;
      top: 30px;
      height: 500px;
      width: 33%;
    }

    .main-wrapper {
      height: 1000px;
      background-color: rgb(242, 242, 242);
    }

    td {
      padding: 10px;
    }
    
    table {
      margin: 20px;
    }

    mat-slide-toggle {
      text-align: left !important;
    }
  `],
  providers: [ BatteryLevelService ]
})
export class BatteryLevelComponent implements OnInit {

    batteryLevel: string = '--';
    device: any = {};

    constructor(
      public _zone: NgZone,
      public _batteryLevelService: BatteryLevelService
    ) {}

    ngOnInit() {
      this.getDeviceStatus();
      this.streamValues();

var deferredPrompt;
var btnSave = document.querySelectorAll('.addToHome')[0];

    window.addEventListener('beforeinstallprompt', function(e) {
      console.log('beforeinstallprompt Event fired');
      //e.preventDefault();   //I even try with this uncommented no luck so far

      // Stash the event so it can be triggered later.
      deferredPrompt = e;

      return false;
    });

    btnSave.addEventListener('click', function() {
      if(deferredPrompt !== undefined) {
        // The user has had a postive interaction with our app and Chrome
        // has tried to prompt previously, so let's show the prompt.
        deferredPrompt.prompt();

        // Follow what the user has done with the prompt.
        deferredPrompt.userChoice.then(function(choiceResult) {

          console.log(choiceResult.outcome);

          if(choiceResult.outcome == 'dismissed') {
            console.log('User cancelled home screen install');
          }
          else {
            console.log('User added to home screen');
          }

          // We no longer need the prompt.  Clear it up.
          deferredPrompt = null;
        });
      }
    });

    window.addEventListener('appinstalled', (evt) => {
      console.log("INSTALLED");
    });


    }

    streamValues() {
      this._batteryLevelService.streamValues().subscribe(this.showBatteryLevel.bind(this));
    }

    getDeviceStatus() {
      this._batteryLevelService.getDevice().subscribe(
        (device) => {

          if(device) {
            this.device = device;
          }
          else {
            // device not connected or disconnected
            this.device = null;
            this.batteryLevel = '--';
          }
        }
      );
    }

    getFakeValue() {
      this._batteryLevelService.getFakeValue();
    }

    getBatteryLevel() {
      return this._batteryLevelService.getBatteryLevel().subscribe(this.showBatteryLevel.bind(this));
    }

    showBatteryLevel(value: number) {

      // force change detection
      this._zone.run( () =>  {
        console.log('Reading battery level %d', value);
        this.batteryLevel = ''+value;
      });
    }



  }