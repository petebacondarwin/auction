import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidInfoComponent } from './bid-info.component';

describe('BidInfoComponent', () => {
  let component: BidInfoComponent;
  let fixture: ComponentFixture<BidInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
