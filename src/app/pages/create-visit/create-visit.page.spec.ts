import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateVisitPage } from './create-visit.page';

describe('CreateVisitPage', () => {
  let component: CreateVisitPage;
  let fixture: ComponentFixture<CreateVisitPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVisitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
