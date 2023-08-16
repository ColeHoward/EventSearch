import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommunicationService} from "../communication.service";
import {MatDialogRef} from "@angular/material/dialog";


@Component({
  selector: 'app-map-frame',
  templateUrl: './map-frame.component.html',
  styleUrls: ['./map-frame.component.css']
})

export class MapFrameComponent {
  @Input() address!: string;
  @Output() mapClicked = new EventEmitter<void>();
  venueName!: string;
  lat!: number;
  lon!: number;
  zoom: number;
  flag: boolean = true;
  center!: google.maps.LatLngLiteral;
  map: google.maps.Map | undefined;
  constructor(private comm: CommunicationService, private dialogRef: MatDialogRef<MapFrameComponent>) {
    this.zoom = 14;
  }
  options: google.maps.MapOptions = {
    zoomControl: true,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: true,
    fullscreenControl: true,
  }
  async ngOnInit() {
    // subscribe to current venue name
    this.comm.currentVenueName.subscribe((data) => {
      if (data && this.flag){
        this.venueName = data
        this.onVenueChange()
        this.flag = false;
      }
    })
  }
  async getLocationFromAddress(address: string) {
    // Use the geocoding service of Google Maps to get the latitude and longitude coordinates from the address provided by the user
    // Set the lat and lng properties of the component with the obtained coordinates
    let res = await this.comm.getLocation(false, address)
    let [lat, lon] = [res['lat'], res['lon']]
    return [lat, lon]
  }
  async onVenueChange(){
    // Call the getLocationFromAddress method of the component to get the coordinates of the address provided by the parent component
    let loc = await this.getLocationFromAddress(this.venueName);
    if (loc){
      this.lat = loc[0]
      this.lon = loc[1]
    }
    this.center = {lat: this.lat, lng: this.lon};
    // await this.loadMap();
  }
  // async loadMap(): Promise<any>{
  //   // taken from google developer documentation
  //   // https://developers.google.com/maps/documentation/javascript/overview
  //   // @ts-ignore
  //   const {Map} = await google.maps.importLibrary('maps');
  //   this.map = new Map(document.getElementById('map') as HTMLElement, {
  //     center: this.center,
  //     zoom: this.zoom,
  //     options: this.options
  //   });
  //   // change styles
  //   // let mapChild = document.querySelector('#map div:first-child')
  //   // mapChild?.setAttribute('style', 'height: 100%; width: 100%; position: relative; overflow: hidden;')
  // }
  closeMap(): void {
    this.dialogRef.close();
  }
}
