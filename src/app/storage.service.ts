import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {EventData} from "./models/EventData";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private favoritesChanged = new BehaviorSubject<Object>(1);
  favoritesChanged$ = this.favoritesChanged.asObservable();
  constructor() {}
  broadcastFavoritesChanged() {
    this.favoritesChanged.next(1);
  }
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  get(key: string) {
    let value = localStorage.getItem(key);
    if (value){
      return JSON.parse(value);
    }
  }
  delete(key: string) {
    console.log('key to be deleted', key)
    localStorage.removeItem(key);
  }
  getAll() {
    let data: EventData[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      console.log('key', key)
      let value = null;
      if (key){
        value = localStorage.getItem(key);
      }
      if (key && value) {
        data.push(JSON.parse(value));
      }
    }
    console.log('local storage data', data)
    return data;
  }
}
