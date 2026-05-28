import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScannerPagePage } from './scanner-page.page';

describe('SacannerPagePage', () => {
  let component: ScannerPagePage;
  let fixture: ComponentFixture<ScannerPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ScannerPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
