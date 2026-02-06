import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Racepass } from './racepass';

describe('Racepass', () => {
  let component: Racepass;
  let fixture: ComponentFixture<Racepass>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Racepass]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Racepass);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
