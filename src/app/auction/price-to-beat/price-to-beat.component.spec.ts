import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceToBeatComponent } from './price-to-beat.component';

describe('PriceToBeatComponent', () => {
  let component: PriceToBeatComponent;
  let fixture: ComponentFixture<PriceToBeatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceToBeatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceToBeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
