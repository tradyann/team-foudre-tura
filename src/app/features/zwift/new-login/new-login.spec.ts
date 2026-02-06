import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLogin } from './new-login';

describe('NewLogin', () => {
  let component: NewLogin;
  let fixture: ComponentFixture<NewLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
