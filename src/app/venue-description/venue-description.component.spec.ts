import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueDescriptionComponent } from './venue-description.component';

describe('VenueDescriptionComponent', () => {
  let component: VenueDescriptionComponent;
  let fixture: ComponentFixture<VenueDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VenueDescriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VenueDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
