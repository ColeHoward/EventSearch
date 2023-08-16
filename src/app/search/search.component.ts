import {ChangeDetectorRef, Component} from '@angular/core';
import {CommunicationService} from "../communication.service";
import {EventData} from "../models/EventData";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  events: EventData[];
  constructor(private sharedService: CommunicationService, private changeDetectorRef: ChangeDetectorRef){
    this.events = [];
  }

  ngOnInit() {
    this.sharedService.currentEvents.subscribe((events) => {
      console.log('events updated:', events);
      if (events) {
        this.events = events
      }else {
        this.events = [];
      }
    });
  }
}
