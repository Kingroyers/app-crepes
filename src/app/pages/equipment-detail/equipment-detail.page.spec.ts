import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EquipmentDetailPage } from './equipment-detail.page';

describe('EquipmentDetailPage', () => {
  let component: EquipmentDetailPage;
  let fixture: ComponentFixture<EquipmentDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
