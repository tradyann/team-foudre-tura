import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallRanking } from './overall-ranking';

describe('OverallRanking', () => {
  let component: OverallRanking;
  let fixture: ComponentFixture<OverallRanking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverallRanking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverallRanking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
