import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Competition } from './competition';

describe('Competition', () => {
  let component: Competition;
  let fixture: ComponentFixture<Competition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Competition]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Competition);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
