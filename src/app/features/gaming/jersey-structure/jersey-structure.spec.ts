import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JerseyStructure } from './jersey-structure';

describe('JerseyStructure', () => {
  let component: JerseyStructure;
  let fixture: ComponentFixture<JerseyStructure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JerseyStructure]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JerseyStructure);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
