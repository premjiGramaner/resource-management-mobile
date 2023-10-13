import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusTrackerPage } from './status-tracker.page';

describe('StatusTrackerPage', () => {
  let component: StatusTrackerPage;
  let fixture: ComponentFixture<StatusTrackerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StatusTrackerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
