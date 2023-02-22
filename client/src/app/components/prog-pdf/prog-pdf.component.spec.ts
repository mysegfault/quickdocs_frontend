import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgPDFComponent } from './prog-pdf.component';

describe('ProgPDFComponent', () => {
  let component: ProgPDFComponent;
  let fixture: ComponentFixture<ProgPDFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgPDFComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgPDFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
