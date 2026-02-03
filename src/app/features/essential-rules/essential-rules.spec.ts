import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssentialRules } from './essential-rules';

describe('EssentialRules', () => {
  let component: EssentialRules;
  let fixture: ComponentFixture<EssentialRules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EssentialRules]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EssentialRules);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
