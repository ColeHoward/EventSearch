import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {CommunicationService} from '../communication.service'
import {MatDialog} from "@angular/material/dialog";
import {MapFrameComponent} from "../map-frame/map-frame.component";


@Component({
  selector: 'app-venue-description',
  templateUrl: './venue-description.component.html',
  styleUrls: ['./venue-description.component.css']
})

export class VenueDescriptionComponent {
  // @Output() childEvent = new EventEmitter<string>();
  venueName: string;
  address: string;
  phoneNumber: string;
  openHours: string;
  generalRule: string;
  childRule: string;
  mapDisplayed: boolean;
  showMoreChildRule: boolean;
  showMoreGeneralRule: boolean;
  showMoreOpenHours: boolean;
  private map: { "#item7": boolean; "#item6": boolean; "#item5": boolean };

  constructor (private CommunicationService: CommunicationService, private dialog: MatDialog) {
    this.address = ''
    this.venueName = ''
    this.phoneNumber = ''
    this.openHours = ''
    this.generalRule = ''
    this.childRule = ''
    this.mapDisplayed = false;
    this.showMoreChildRule = false;
    this.showMoreGeneralRule = false;
    this.showMoreOpenHours = false;
    this.childRule = ''
    this.map = {"#item5": this.showMoreGeneralRule, "#item6": this.showMoreChildRule, "#item7": this.showMoreOpenHours}
  }
  async ngOnInit() {
    this.CommunicationService.currentVenueName.subscribe((data) => {
      if (data){
        this.venueName = data
        this.onVenueChange()
      }
    });
  }

  showMap() {
    const modalRef = this.dialog.open(MapFrameComponent, {
    })
    modalRef.afterOpened().subscribe(() => {
      this.mapDisplayed = true;
      let mapChild = document.querySelector('#map div:first-child')
      mapChild?.setAttribute('style', 'height: 100%; width: 100%; position: relative; overflow: hidden;')
    });
  }

  async onVenueChange(){
    let venueDetails = await this.CommunicationService.getVenueDetails(this.venueName);
    this.address = venueDetails.Address;
    this.phoneNumber = venueDetails.phone;
    this.openHours = venueDetails.openHours;
    this.generalRule = venueDetails.generalRule;
    this.childRule = venueDetails.childRule;
  }


  changeGeneralView() {
    this.showMoreGeneralRule = !this.showMoreGeneralRule;
    let el = document.getElementById('#item5');
    if (el) {
      el.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }
  }
  changeChildView() {
    this.showMoreChildRule = !this.showMoreChildRule;
    let el = document.getElementById('#item6');
    if (el) {
      el.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }
  }

  changeMoreHoursView() {
    this.showMoreOpenHours = !this.showMoreOpenHours;
    let el = document.getElementById('#item4');
    if (el) {
      el.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }
  }
}
