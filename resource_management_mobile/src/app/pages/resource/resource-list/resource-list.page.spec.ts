import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceListPage } from './resource-list.page';

describe('ResourceListPage', () => {
  let component: ResourceListPage;
  let fixture: ComponentFixture<ResourceListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ResourceListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
