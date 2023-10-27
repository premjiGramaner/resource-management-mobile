import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkillPage } from './skill.page';

describe('SkillPage', () => {
  let component: SkillPage;
  let fixture: ComponentFixture<SkillPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SkillPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
