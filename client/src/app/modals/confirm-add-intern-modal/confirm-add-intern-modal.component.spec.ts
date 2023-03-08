import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAddInternModalComponent } from './confirm-add-intern-modal.component';

describe('ConfirmAddInternModalComponent', () => {
  let component: ConfirmAddInternModalComponent;
  let fixture: ComponentFixture<ConfirmAddInternModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmAddInternModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmAddInternModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
