import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Categorization } from './categorization';

describe('Categorization', () => {
  let component: Categorization;
  let fixture: ComponentFixture<Categorization>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Categorization]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Categorization);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
