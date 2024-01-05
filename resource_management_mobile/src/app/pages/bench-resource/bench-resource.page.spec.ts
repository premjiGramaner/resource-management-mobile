import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BenchResourcePage } from './bench-resource.page';

describe('BenchResourcePage', () => {
  let component: BenchResourcePage;
  let fixture: ComponentFixture<BenchResourcePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BenchResourcePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
