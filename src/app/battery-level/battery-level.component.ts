import { Component, OnInit, NgZone } from '@angular/core';
import { BatteryLevelService } from '../battery-level.service';
import { BluetoothCore } from '@manekinekko/angular-web-bluetooth';
//A Coomet for fun
@Component({
  selector: 'ble-battery-level',
  template: `
    <a href="#" (click)="getBatteryLevel()">Get Battery Level ({{batteryLevel || 'N/A'}}%)</a>
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

	let deferredPrompt;
    var btnAdd = document.querySelectorAll('.addToHome')[0];

	window.addEventListener('beforeinstallprompt', (e) => {
	  // Prevent Chrome 67 and earlier from automatically showing the prompt
	  e.preventDefault();
	  // Stash the event so it can be triggered later.
	  deferredPrompt = e;
	  // Update UI notify the user they can add to home screen
	  btnAdd.style.display = 'block';
	});


	btnAdd.addEventListener('click', (e) => {
  // hide our user interface that shows our A2HS button
  btnAdd.style.display = 'none';
  // Show the prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice
    .then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
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