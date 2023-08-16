import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {CommunicationService} from '../communication.service'
import {FormControl} from "@angular/forms";
import {EventData} from "../models/EventData";


@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent {
  // https://stackoverflow.com/questions/35945001/binding-select-element-to-object-in-angular
  public myControl = new FormControl('');
  constructor(private CommunicationService: CommunicationService, private changeDetectorRef: ChangeDetectorRef) {
    this.autoLoc = false
    this.location = ''
    this.keywords = ''
    this.distance = 10
    this.showTable = false
    this.selectedCategory = this.categories[0].id
  }
  categories = [
    { id: 0, name: 'Default' },
    { id: 1, name: 'Music' },
    { id: 2, name: 'Sports' },
    { id: 3, name: 'Arts & Theater' },
    { id: 4, name: 'Film' },
    { id: 5, name: 'Miscellaneous' }
  ];
  selectedCategory: number;
  keywords: string;
  location: string;
  autoLoc: boolean;
  distance: number;
  suggestions?: string[]
  showTable: boolean
  clear() {
    this.keywords = ''
    this.location = ''
    this.distance = 10
    this.selectedCategory = this.categories[0].id
    this.autoLoc = false
    const locElement = document.getElementById('location')
    if (locElement){
      locElement.style.display = 'unset'
    }
    const table = document.getElementById('table-container')
    if (table) table.style.display = 'none'
    let noEventsRow = document.getElementById('no-events-row')
    if (noEventsRow) noEventsRow.style.display = 'none'
  }
  handleRequired(){
    const location = document.getElementById('location')
    const checkbox = document.getElementById('auto-loc')
    if (this.autoLoc){
      if (checkbox && location && location.hasAttribute('required')){
        location.removeAttribute('required')
        this.location = ''
        checkbox.setAttribute('required', '')
      }
    }else{
      if(location && checkbox) {
        location.setAttribute('required', '')
        checkbox.removeAttribute('required')
      }
    }
  }
  async search(){
    type LatLon = {'lat': number, 'lon': number}
    let loc: LatLon  = await this.CommunicationService.getLocation(this.autoLoc, this.location)
    let [lat, lon] = [loc.lat, loc.lon]
    let events: EventData[] = await this.CommunicationService.getEvents(this.keywords, lat, lon, this.distance,
                                                                        this.categories[this.selectedCategory].name)
    console.log('events', events)
    this.CommunicationService.broadcastShowEventDetails(false)
    let eventIdPair = new Map()
    if (events.length > 0) {
      for (let event of events) {
        eventIdPair.set(event.Name, event.eventId)
      }
      this.CommunicationService.broadcastNoEventsFound(false)
      console.log('broadcasted false')
    }else{
      this.CommunicationService.broadcastNoEventsFound(true)
      console.log('broadcasted true')
    }
    this.CommunicationService.broadcastShowEventDetails(false)
    this.CommunicationService.broadcastEventDetails({} as EventData)
    this.CommunicationService.broadcastEventIdPairs(eventIdPair)
    const table = document.getElementById('table-container')
    if (!events || Object.keys(events).length == 0){
      let noEventsRow = document.getElementById('no-events-row')
      if (noEventsRow) noEventsRow.style.display = 'block'
      if (table) table.style.display = 'none'
    }else{
      let noEventsRow = document.getElementById('no-events-row')
      if (noEventsRow) noEventsRow.style.display = 'none'
      this.CommunicationService.broadcastEvents(events);
      if (table) table.style.display = 'block'
    }
    this.changeDetectorRef.detectChanges()
    this.CommunicationService.broadcastShowTable(true)
  }
  async updateSuggestions() {
    if (this.keywords != '') {
      this.CommunicationService.getSuggestions(this.keywords).then((suggestions: string[]) => {
        this.suggestions = suggestions
      })
    }
  }
}
