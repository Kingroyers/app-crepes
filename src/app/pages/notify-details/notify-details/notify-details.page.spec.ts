import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotifyDetailsPage } from './notify-details.page';

describe('NotifyDetailsPage', () => {
  let component: NotifyDetailsPage;
  let fixture: ComponentFixture<NotifyDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifyDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
