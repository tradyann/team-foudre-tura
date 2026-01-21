import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZwiftLinked } from './zwift-linked';

describe('ZwiftLinked', () => {
  let component: ZwiftLinked;
  let fixture: ComponentFixture<ZwiftLinked>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZwiftLinked]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZwiftLinked);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
