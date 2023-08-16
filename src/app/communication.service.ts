import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {EventData} from "./models/EventData";
import {EventDetail} from "./models/eventDetail";

@Injectable({
  providedIn: 'root'
})

// https://www.freakyjolly.com/mat-autocomplete-with-http-api-remote-search-results/
export class CommunicationService {
  private eventsData = new BehaviorSubject<any>(null);
  private eventDetails = new BehaviorSubject<any>(null);
  private eventIdPairs = new BehaviorSubject<any>(null);
  private venueName = new BehaviorSubject<any>(null);
  private artistNames = new BehaviorSubject<any>(null);
  private eventName = new BehaviorSubject<any>(null);
  private showEventDetails = new BehaviorSubject<any>(null);
  private isMusician = new BehaviorSubject<any>(null);
  private noEventsFound = new BehaviorSubject<boolean>(false);
  private artistDetails = new BehaviorSubject<any>(null);
  private showTable = new BehaviorSubject<boolean>(false);
  $showTable = this.showTable.asObservable();
  $artistDetails = this.artistDetails.asObservable();
  $noEventsFound = this.noEventsFound.asObservable();
  currentIsMusician = this.isMusician.asObservable();
  currentShowEventDetails = this.showEventDetails.asObservable();
  currentEventName = this.eventName.asObservable();
  currentArtistNames = this.artistNames.asObservable();
  currentVenueName = this.venueName.asObservable();
  currentEventIdPairs = this.eventIdPairs.asObservable();
  currentEvents = this.eventsData.asObservable();
  currentEventDetails = this.eventDetails.asObservable()
  ipInfoUrl = 'https://ipinfo.io/json?token=dd97d5b77dc686'
  mapsKey = 'AIzaSyAUwvJeHowcynAEPJZVVzi-3AHabdMBvrw'
  geoCodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json'
  backendUrl = 'https://homework8-381923.wl.r.appspot.com'
  // backendUrl = 'http://localhost:3000'
  twitterUrl = 'https://twitter.com/intent/tweet'
  faceBookUrl = 'https://www.facebook.com/sharer/sharer.php'
  constructor() { }
  async getLocation(autLoc: boolean, locArgs: string) {
    let [lat, lon] = [0, 0]
    if (autLoc) {
      let request = await fetch(this.ipInfoUrl)
      let loc = await request.json()
      loc = loc['loc'].split(',')
      lat = loc[0]
      lon = loc[1]
      return {'lat': lat, 'lon': lon} as {'lat': number, 'lon': number}
    } else {
      let [lat, lon] = [-1, -1]
      let formattedArgs = locArgs.split(' ').join('+')
      let geoUrl = `${this.geoCodeUrl}?address=${formattedArgs}&key=${this.mapsKey}`
      await fetch(geoUrl).then((resp) => {
        if (resp.ok){
          return resp.json()
        }else{
          throw new Error('geocode fetch didnt work')
        }
      }).then((jsonData) => {
          lat = jsonData?.results[0]?.geometry?.location?.lat
          lon = jsonData?.results[0]?.geometry?.location?.lng
      }).catch((error) =>{
          console.log('fetch error in getLocation:', error)
        })
      return {'lat': lat, 'lon': lon} as {'lat': number, 'lon': number}
    }
  }
  async getSuggestions(keywords: string) {
    let resp = await fetch(`${this.backendUrl}/suggestions/${keywords}`)
    let obj = await resp.json()
    let vals: string[] = []
    Object.keys(obj).forEach(function(key) {
      vals.push(obj[key])
    });
    return vals
  }
  async getEvents(keywords: string, lat: number, lon: number, radius: number, category: string) {
    let res = await fetch(`${this.backendUrl}/event?lat=${lat}&lon=${lon}&radius=${radius}&category=${category}&keywords=${keywords}`)
    return await res.json()
  }
  broadcastEvents(data:EventData[]){
    this.eventsData.next(data);
  }
  broadcastEventIdPairs(pairs: Map<string, string>) {
    this.eventIdPairs.next(pairs)
  }
  broadcastVenueName(name: string) {
    this.venueName.next(name)
  }
  broadcastShowEventDetails(show: boolean) {
    this.showEventDetails.next(show)
  }
  broadcastShowTable(show: boolean) {
    this.showTable.next(show)
  }
  broadcastEventDetails(eventDetails: EventData) {
    this.eventDetails.next(eventDetails)
  }
  broadcastEventName(name: string) {
    this.eventName.next(name)
  }
  broadcastIsMusician(isMusician: boolean) {
    this.isMusician.next(isMusician)
  }
  broadcastArtistDetails(artistDetails: EventData) {
    this.artistDetails.next(artistDetails)
  }
  async setArtistNames(eventId: string | undefined) {
    console.log('eventId', eventId)
    if (eventId) {
      await fetch(this.backendUrl + '/event/' + eventId).then((resp) => {
         return resp.json()
      }).then((jsonData) => {
        console.log('new artist names:', jsonData)
        this.artistNames.next(jsonData)
      })
        .catch((error) => {
        console.error('fetch error in setArtistNames:', error)
      })
    }
  }
  async getVenueDetails(venueName: string) {
    return await fetch(this.backendUrl + '/venue/' + venueName).then((resp) => {
      if (resp.ok) {
        return resp.json()
      } else {
        throw new Error('venue details fetch didnt work')
      }
    }).then((jsonData) => {
      return jsonData
    }).catch((error) => {
      console.error('fetch error:', error)
    })
  }

  async getArtistDetails(eventId: string) {
    return await fetch(this.backendUrl + '/spotify/artist/' + eventId).then((resp) => {
      if (resp.ok) {
        return resp.json()
      } else {
        throw new Error('artist details fetch didnt work')
      }
    }).catch((error) => {
      console.error('fetch error in getArtistDetails:', error)
    })
  }
  async getArtistAlbumDetails(artistId:string) {
    return await fetch(this.backendUrl + '/spotify/albums/' + artistId).then((resp) => {
      if (resp.ok) {
        return resp.json()
      } else {
        throw new Error('artist album details fetch didnt work')
      }
    }).catch((error) => {
      console.error('fetch error in getArtistAlbumDetails:', error)
    })
  }

  async shareToTwitter(eventName: string, buy_ticket: string) {
    let tweet = ''
    if (eventName) {
      tweet = `check out ${eventName} on TicketMaster.`
    }
    let fullUrl = `${this.twitterUrl}?text=${encodeURIComponent(tweet)}&url=${encodeURIComponent(buy_ticket)}`
    window.open(fullUrl, '_blank', 'noopener noreferrer');
  }
  async shareToFacebook(buyTicket: string) {
    let fullUrl = `${this.faceBookUrl}?u=${encodeURIComponent(buyTicket)}`
    window.open(fullUrl, '_blank', 'noopener noreferrer')
  }
  broadcastNoEventsFound(b: boolean) {
    this.noEventsFound.next(b)
  }
}
