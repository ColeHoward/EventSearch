import { Component, ElementRef, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import {CommunicationService} from "../communication.service";
import {Artist} from "../models/artist";
import {Carousel} from "bootstrap";
import {EventData} from "../models/EventData";


@Component({
  selector: 'app-artist-description',
  templateUrl: './artist-description.component.html',
  styleUrls: ['./artist-description.component.css']
})
export class ArtistDescriptionComponent {
  @ViewChild('artistCarousel', { static: false }) artistCarousel?: ElementRef;

  private carouselInstance!: Carousel;
  spinnerWidth: number;
  diameter: number;
  artistNames: string[];
  artistDetails!: Artist[];
  isMusician: boolean;
  eventId!: string;
  constructor(private comm: CommunicationService) {
    this.spinnerWidth = 3;
    this.diameter = 35;
    this.artistNames = [];
    this.artistDetails = [{name: '', id: '', url: '', popularity: 0, numFollowers: 0, albumImgs: [], artistImg: ''}];
    this.isMusician = true
  }
  async ngOnInit(): Promise<void> {
    // subscribe to artist names
    // this.comm.currentArtistNames.subscribe((data) => {
    //   if (data) {
    //     this.artistNames = data;
    //     if (this.artistNames.length > 0) {
    //       this.setArtistDetails()
    //       console.log('artist details have been received')
    //     }
    //   }
    // })
    this.comm.$artistDetails.subscribe((data) => {
      if (data) {
        this.setArtistDetails(data)
        if (window.innerWidth < 768) {
          console.log('window width is good')
          let level2 = document.querySelector('#level2')
          if(level2){
            (level2 as HTMLElement).style.marginTop = '60vh'
            console.log('margin top changed')
            console.log('level 2 found')
          }
          let level1Items = document.querySelectorAll('.level1-item');
          if (level1Items){
            level1Items.forEach((element: Element) => {
              (element as HTMLElement).style.marginTop = '5vh';
            });
          }
        }
      }
    })
    this.comm.currentEventDetails.subscribe((data: EventData) => {
      if (data) {
        this.eventId = data.eventId
      }
    })
  }
  async setArtistDetails(artistDetails: any) {
    if (!artistDetails || artistDetails.length === 0) {
      this.artistDetails = []
      return
    }
    let newArtistFlag = false
    let sliceStart = this.artistDetails.length
    if (artistDetails && artistDetails.length > 0) {
      newArtistFlag = true
      for (let artist of artistDetails) {
        // (name, id, image, genres, popularity, spotifyUrl)
        let albumImgs = await this.comm.getArtistAlbumDetails(artist.id)
        let newArtist: Artist = {
          name: artist.name,
          id: artist.id,
          url: artist.spotifyUrl,
          popularity: artist.popularity,
          numFollowers: artist.numFollowers,
          albumImgs: albumImgs,
          artistImg: artist.image
        }
        console.log('new artist', newArtist)

        this.artistDetails.push(newArtist)
      }
    }


    if (newArtistFlag) {
      this.artistDetails = this.artistDetails.slice(sliceStart)
    }
    console.log('in this funjction')
    if (this.artistCarousel) {
      this.carouselInstance = Carousel.getOrCreateInstance(this.artistCarousel.nativeElement);
      console.log('in other functionb')

    } else {
      console.error('carousel not found');
    }
  }
  slideBackward(event: Event) {
    event.preventDefault();
    this.carouselInstance.prev();
  }

  slideForward(event: Event) {
    event.preventDefault();
    this.carouselInstance.next();
  }
}
