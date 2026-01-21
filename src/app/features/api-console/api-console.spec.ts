import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiConsole } from './api-console';

describe('ApiConsole', () => {
  let component: ApiConsole;
  let fixture: ComponentFixture<ApiConsole>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiConsole]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiConsole);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
