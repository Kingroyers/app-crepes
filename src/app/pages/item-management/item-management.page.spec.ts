import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemManagementPage } from './item-management.page';

describe('ItemManagementPage', () => {
  let component: ItemManagementPage;
  let fixture: ComponentFixture<ItemManagementPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
