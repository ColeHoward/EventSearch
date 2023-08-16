import { Component, ChangeDetectorRef } from '@angular/core';
import {CommunicationService} from "./communication.service";

// import { passiveSupport } from 'passive-events-support/src/utils'

// passiveSupport({ debug: true })
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hw8';
  constructor() {
  }
}
