import { Component } from '@angular/core';
import {CommunicationService} from "../communication.service";
import {EventData} from "../models/EventData";
import {Statuses} from "../models/Statuses";

@Component({
  selector: 'app-event-description',
  templateUrl: './event-description.component.html',
  styleUrls: ['./event-description.component.css']
})
export class EventDescriptionComponent {
  twitterIcon: string = "assets/icons/twitter.svg";
  fbIcon: string = "assets/icons/facebook.svg";
  date_string: string;
  artist_team: string;
  venue: string;
  genres: string;
  price_ranges: string;
  ticket_status!: string;
  buy_ticket: string;
  seatMap: string;
  statusMap: Statuses;
  eventName: string;
  constructor(private sharedService: CommunicationService) {
    this.statusMap = { "onsale": ["On Sale", 'on-sale'], "rescheduled": ['Rescheduled', 'rescheduled'],
       'offsale': ["Off Sale", 'off-sale'], 'undefined': ["Off Sale", 'off-sale'],
       'cancelled': ['Canceled', 'canceled'], 'postponed': ['Postponed', 'postponed']}
    this.date_string = ''
    this.artist_team = ''
    this.venue = ''
    this.genres = ''
    this.price_ranges = ''
    this.ticket_status = ''
    this.buy_ticket = ''
    this.seatMap = ''
    this.eventName = ''
  }
  ngOnInit() {
    this.sharedService.currentEventDetails.subscribe((data: EventData) => {
      if (data){
        this.date_string = data.date;
        this.artist_team = this.getSegmentedString(data.artists);
        this.venue = data.venue;
        this.genres = this.getSegmentedString([data.genre, data.subGenre, data.type]);
        this.price_ranges = data.priceRanges;
        this.ticket_status = data.ticketStatus;
        this.buy_ticket = data.buyTickets;
        this.seatMap = data.seatMap;
        this.eventName = data.Name;
      }
    })
  }
  shareTwitter() {
    if (this.buy_ticket != '' && this.buy_ticket != undefined && this.buy_ticket.toLowerCase() != "undefined") {
      console.log('buy ticket: ' + this.buy_ticket, 'artist_team: ' + this.artist_team)
      if (this.eventName === ''){
        this.eventName = this.artist_team;
      }
      this.sharedService.shareToTwitter(this.eventName, this.buy_ticket)
    }
  }
  shareFacebook() {
    if (this.buy_ticket != '' && this.buy_ticket != undefined && this.buy_ticket.toLowerCase() != "undefined") {
      this.sharedService.shareToFacebook(this.buy_ticket)
    }
  }
  getSegmentedString(stringList: string[]) {
    let segmentedString = ""
    for (let i = 0; i < stringList.length; i++) {
      if (stringList[i] === "" || typeof(stringList[i]) === "undefined" || stringList[i].toLowerCase() === "undefined"){
        continue;
      }
      if (segmentedString !== ""){
        segmentedString += " | " + stringList[i]
      }else {
        segmentedString += stringList[i]
      }
    }
    return segmentedString
  }
}
