import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderDetails } from './rider-details';

describe('RiderDetails', () => {
  let component: RiderDetails;
  let fixture: ComponentFixture<RiderDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiderDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiderDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
