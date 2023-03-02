import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocInternComponent } from './doc-intern.component';

describe('DocInternComponent', () => {
  let component: DocInternComponent;
  let fixture: ComponentFixture<DocInternComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocInternComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocInternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
