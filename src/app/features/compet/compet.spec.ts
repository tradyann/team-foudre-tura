import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Compet } from './compet';

describe('Compet', () => {
  let component: Compet;
  let fixture: ComponentFixture<Compet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Compet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Compet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
