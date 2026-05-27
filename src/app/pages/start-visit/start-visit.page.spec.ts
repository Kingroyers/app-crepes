import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StartVisitPage } from './start-visit.page';

describe('StartVisitPage', () => {
  let component: StartVisitPage;
  let fixture: ComponentFixture<StartVisitPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StartVisitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
