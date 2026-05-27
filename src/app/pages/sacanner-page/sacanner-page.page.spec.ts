import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SacannerPagePage } from './sacanner-page.page';

describe('SacannerPagePage', () => {
  let component: SacannerPagePage;
  let fixture: ComponentFixture<SacannerPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SacannerPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
