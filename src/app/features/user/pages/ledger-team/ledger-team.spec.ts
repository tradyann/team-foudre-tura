import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerTeam } from './ledger-team';

describe('LedgerTeam', () => {
  let component: LedgerTeam;
  let fixture: ComponentFixture<LedgerTeam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LedgerTeam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LedgerTeam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
