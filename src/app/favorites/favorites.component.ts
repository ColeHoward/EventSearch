import { Component } from '@angular/core';
import {StorageService} from "../storage.service";
import {EventData} from "../models/EventData";
import {Favorite} from "../models/Favorite";
@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent {
  dataSource?: Favorite[];
  displayedColumns: any;
  constructor(private storage: StorageService) {}
  ngOnInit() {
    this.displayedColumns = ['index', 'date', 'event', 'category', 'venue', 'isFavorite'];
    this.storage.favoritesChanged$.subscribe((data) => {
      this.constructDataSource()
    })
  }

  constructDataSource() {
    console.log(window.innerWidth, '<-- inner width')
    let data: EventData[] = this.storage.getAll();
    console.log('favorites stored', data)
    let favorites: Favorite[] = []
    let i = 1;
    for (let event of data) {
      let eventName = event.Name
      let eventDate = event.date
      let eventCategory = this.getSegmentedString([event.genre, event.subGenre, event.segments])
      favorites.push({index: i, name: eventName, date: eventDate, categories: eventCategory, venue: event.venue, isFavorite: true})
      i++;
    }
    this.dataSource = favorites
  }
  removeFavorite(eventName: string) {
    this.storage.delete(eventName)
    this.constructDataSource()
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
