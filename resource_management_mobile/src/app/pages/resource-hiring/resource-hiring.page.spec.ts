import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceHiringPage } from './resource-hiring.page';

describe('ResourceHiringPage', () => {
  let component: ResourceHiringPage;
  let fixture: ComponentFixture<ResourceHiringPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ResourceHiringPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
