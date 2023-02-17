import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgRectoComponent } from './prog-recto.component';

describe('ProgRectoComponent', () => {
  let component: ProgRectoComponent;
  let fixture: ComponentFixture<ProgRectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgRectoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgRectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
