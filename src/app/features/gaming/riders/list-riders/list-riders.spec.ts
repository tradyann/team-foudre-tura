import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRiders } from './list-riders';

describe('ListRiders', () => {
  let component: ListRiders;
  let fixture: ComponentFixture<ListRiders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListRiders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRiders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
