import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCategory } from './my-category';

describe('MyCategory', () => {
  let component: MyCategory;
  let fixture: ComponentFixture<MyCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
