import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistDescriptionComponent } from './artist-description.component';

describe('ArtistDescriptionComponent', () => {
  let component: ArtistDescriptionComponent;
  let fixture: ComponentFixture<ArtistDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtistDescriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
