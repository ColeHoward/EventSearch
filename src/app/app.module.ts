import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchFormComponent } from './search-form/search-form.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { NavigationComponent } from './navigation/navigation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import {EventsTableComponent} from './events-table/events-table.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { EventDescriptionComponent } from './event-description/event-description.component';
import { ArtistDescriptionComponent } from './artist-description/artist-description.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { VenueDescriptionComponent } from './venue-description/venue-description.component';
import { MapFrameComponent } from './map-frame/map-frame.component';
import {GoogleMapsModule} from "@angular/google-maps";
import {MatDialogModule} from "@angular/material/dialog";
import { CarouselComponent } from './carousel/carousel.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatDividerModule} from "@angular/material/divider";
import { SearchComponent } from './search/search.component';
import { FavoritesComponent } from './favorites/favorites.component';


@NgModule({
  declarations: [
    AppComponent,
    SearchFormComponent,
    NavigationComponent,
    EventsTableComponent,
    EventsTableComponent,
    EventsTableComponent,
    EventDetailsComponent,
    EventDescriptionComponent,
    ArtistDescriptionComponent,
    VenueDescriptionComponent,
    MapFrameComponent,
    CarouselComponent,
    SearchComponent,
    FavoritesComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        BrowserAnimationsModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        MatInputModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        GoogleMapsModule,
        MatDialogModule,
        MatTabsModule,
        MatDividerModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
