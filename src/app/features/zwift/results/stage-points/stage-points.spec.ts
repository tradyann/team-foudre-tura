import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StagePoints } from './stage-points';

describe('StagePoints', () => {
  let component: StagePoints;
  let fixture: ComponentFixture<StagePoints>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StagePoints]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StagePoints);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
