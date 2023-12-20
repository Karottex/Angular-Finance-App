import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalbarchartComponent } from './verticalbarchart.component';

describe('VerticalbarchartComponent', () => {
  let component: VerticalbarchartComponent;
  let fixture: ComponentFixture<VerticalbarchartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerticalbarchartComponent]
    });
    fixture = TestBed.createComponent(VerticalbarchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
