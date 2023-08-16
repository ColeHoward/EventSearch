import {Component} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {EventData} from "../models/EventData";
import {CommunicationService} from "../communication.service";
import {EventDetail} from "../models/eventDetail";

@Component({
  selector: 'app-events-table',
  templateUrl: './events-table.component.html',
  styleUrls: ['./events-table.component.css']
})

export class EventsTableComponent {
  displayedColumns: string[] = ['Date', 'Icon', 'Event', 'Genre', 'Venue'];
  dataSource: MatTableDataSource<EventData> = new MatTableDataSource<EventData>([]);
  eventIdPairs: Map<string, string>;
  noEventsFound?: boolean;
  showTable: boolean = false;
  constructor(private sharedService: CommunicationService) {
    this.eventIdPairs = new Map<string, string>();
    this.dataSource = new MatTableDataSource<EventData>([]);
    this.noEventsFound = false;
    console.log('in constructor', this.dataSource)
    console.log('in constructor', this.dataSource.data.length)
  }
  ngOnInit() {
    this.sharedService.currentEvents.subscribe((data) => {
      if (data){
        this.dataSource.data = data
        this.noEventsFound = false;
        console.log('table data', this.dataSource)
      }else{
        this.dataSource.data = [];
        this.noEventsFound = true;
      }
    });
    // subscribe to event id pairs
    this.sharedService.currentEventIdPairs.subscribe((data) => {
      if (data){
        this.eventIdPairs = data
      }
    })
    this.sharedService.$noEventsFound.subscribe((data) => {
      this.noEventsFound = data
    })
    this.sharedService.$showTable.subscribe((data) => {
      this.showTable = data
    })
  }

  async displayEventDetails(eventDetail: EventData) {
    this.showTable = false
    let isMusician = eventDetail.segments.toLowerCase() === "music"
    this.sharedService.broadcastVenueName(eventDetail.venue);
    console.log('eventDetail', eventDetail)
    let artistDetails = await this.sharedService.getArtistDetails(eventDetail.eventId)
    this.sharedService.broadcastArtistDetails(artistDetails)
    this.sharedService.broadcastEventName(eventDetail.Name);
    this.sharedService.broadcastIsMusician(isMusician)

    this.sharedService.broadcastEventDetails(eventDetail);
    this.sharedService.broadcastShowEventDetails(true)
  }
}


