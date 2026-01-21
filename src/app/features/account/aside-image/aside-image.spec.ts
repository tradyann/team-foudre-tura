import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideImage } from './aside-image';

describe('AsideImage', () => {
  let component: AsideImage;
  let fixture: ComponentFixture<AsideImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsideImage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsideImage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
