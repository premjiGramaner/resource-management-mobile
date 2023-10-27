import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceRequirementPage } from './resource-requirement.page';

describe('ResourceRequirementPage', () => {
  let component: ResourceRequirementPage;
  let fixture: ComponentFixture<ResourceRequirementPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ResourceRequirementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
