import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTeams } from './list-teams';

describe('ListTeams', () => {
  let component: ListTeams;
  let fixture: ComponentFixture<ListTeams>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTeams]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTeams);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
