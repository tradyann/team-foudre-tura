import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionRoutes } from './competition-routes';

describe('CompetitionRoutes', () => {
  let component: CompetitionRoutes;
  let fixture: ComponentFixture<CompetitionRoutes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitionRoutes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetitionRoutes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
