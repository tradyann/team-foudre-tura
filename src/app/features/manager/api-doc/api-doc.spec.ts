import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiDoc } from './api-doc';

describe('ApiDoc', () => {
  let component: ApiDoc;
  let fixture: ComponentFixture<ApiDoc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiDoc]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiDoc);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
