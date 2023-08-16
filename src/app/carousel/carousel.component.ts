import { Component } from '@angular/core';
import { Carousel } from 'bootstrap';
import {CommunicationService} from "../communication.service";

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent {
  slides: any[];
  artistDetails: any;
  // private carouselInstance!: Carousel;

  constructor(private sharedService: CommunicationService) {
    this.slides = this.getSlides();
  }
  ngAfterViewInit() {
    // const carousel = document.getElementById('artist-carousel') as HTMLElement;

    // Get or create a Carousel instance
    // if(carousel) {
    //   this.carouselInstance = Carousel.getOrCreateInstance(carousel);
    // }else {
    //   console.error('carousel not found')
    // }
  }

  getSlides(): any[] {
    // You can replace this with an actual API call or user input
    const slideData = [
      { content: 'Slide 1 content', bgColor: 'lightblue' },
      { content: 'Slide 2 content', bgColor: 'lightgreen' },
      { content: 'Slide 3 content', bgColor: 'lightcoral' }
    ];

    return slideData.map((slide, index) => ({
      id: index,
      content: slide.content,
      bgColor: slide.bgColor
    }));
  }
  // slideForward() {
  //   this.carouselInstance.next();
  // }
  // slideBackward() {
  //   this.carouselInstance.prev();
  // }
}
