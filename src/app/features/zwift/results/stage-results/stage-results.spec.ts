import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageResults } from './stage-results';

describe('StageResults', () => {
  let component: StageResults;
  let fixture: ComponentFixture<StageResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StageResults]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StageResults);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
