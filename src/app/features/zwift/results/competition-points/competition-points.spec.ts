import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionPoints } from './competition-points';

describe('CompetitionPoints', () => {
  let component: CompetitionPoints;
  let fixture: ComponentFixture<CompetitionPoints>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitionPoints]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetitionPoints);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
