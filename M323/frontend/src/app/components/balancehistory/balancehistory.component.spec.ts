import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalancehistoryComponent } from './balancehistory.component';

describe('BalancehistoryComponent', () => {
  let component: BalancehistoryComponent;
  let fixture: ComponentFixture<BalancehistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BalancehistoryComponent]
    });
    fixture = TestBed.createComponent(BalancehistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
