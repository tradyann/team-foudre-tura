import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jersey } from './jersey';

describe('Jersey', () => {
  let component: Jersey;
  let fixture: ComponentFixture<Jersey>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jersey]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Jersey);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
