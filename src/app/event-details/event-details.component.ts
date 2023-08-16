import { Component, ChangeDetectorRef } from '@angular/core';
import { Carousel } from 'bootstrap';
import {CommunicationService} from "../communication.service";
import {StorageService} from "../storage.service";
import {EventData} from "../models/EventData";

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})

export class EventDetailsComponent {
  // need way to get this stuff
  event_name!: string;
  showEventDetails: boolean;
  heartIcon: string;
  chevronIcon: string = "../../assets/icons/chevron-left.svg";

  emptyHeartIcon: string = "../../assets/icons/favorite.svg";
  filledHeartIcon: string = "../../assets/icons/heart-solid.svg";
  eventsData!: EventData;
  constructor (private sharedService: CommunicationService, private storage: StorageService) {
    this.showEventDetails = false
    if (this.storage.get(this.event_name) == 'liked'){
      this.heartIcon = this.filledHeartIcon
    }else {
      this.heartIcon = this.emptyHeartIcon
    }
  }
  ngOnInit() {
    this.sharedService.currentEventName.subscribe((data) => {
      if (data){
        this.event_name = data;
        if (this.storage.get(this.event_name)) {
          this.heartIcon = this.filledHeartIcon
        } else {
          this.heartIcon = this.emptyHeartIcon
        }
      }
    })
    this.sharedService.currentEventDetails.subscribe((data: EventData) => {
      if (data && data != {} as EventData){
        this.eventsData = data;
      }else if (data == {} as EventData){
        this.eventsData = {} as EventData
        this.showEventDetails = false
      }
    })
    this.sharedService.currentShowEventDetails.subscribe((data) => {
      if (data){
        this.showEventDetails = data;
      }
    })
    // this.storage.favoritesChanged$.subscribe((data) => {
    //   if (this.inLocalStorage(this.event_name)){
    //     this.heartIcon = this.filledHeartIcon
    //   } else {
    //     this.heartIcon = this.emptyHeartIcon
    //   }
    // })
  }
  removeEventDetails() {
    this.sharedService.broadcastShowEventDetails(false)
    this.showEventDetails = false
    this.sharedService.broadcastShowTable(true)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  changeHeart(){
    if (this.heartIcon === this.emptyHeartIcon){
      this.heartIcon = this.filledHeartIcon
      this.storage.set(this.event_name, this.eventsData)
      alert('Event added to favorites!')
    } else {
      this.heartIcon = this.emptyHeartIcon
      this.storage.delete(this.event_name)
      alert('Event removed from favorites!')
    }
    this.storage.broadcastFavoritesChanged()
  }
  inLocalStorage(key: string): boolean {
    return this.storage.get(key) != null
  }
}


