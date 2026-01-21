import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerHistory } from './ledger-history';

describe('LedgerHistory', () => {
  let component: LedgerHistory;
  let fixture: ComponentFixture<LedgerHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LedgerHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LedgerHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
