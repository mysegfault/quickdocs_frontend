import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgVersoComponent } from './prog-verso.component';

describe('ProgVersoComponent', () => {
  let component: ProgVersoComponent;
  let fixture: ComponentFixture<ProgVersoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgVersoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgVersoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
