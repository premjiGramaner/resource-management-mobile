import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequirementPage } from './requirement.page';

describe('RequirementPage', () => {
  let component: RequirementPage;
  let fixture: ComponentFixture<RequirementPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RequirementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
