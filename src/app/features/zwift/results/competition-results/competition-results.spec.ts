import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionResults } from './competition-results';

describe('CompetitionResults', () => {
  let component: CompetitionResults;
  let fixture: ComponentFixture<CompetitionResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitionResults]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetitionResults);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
