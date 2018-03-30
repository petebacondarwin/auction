import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidderInfoComponent } from './bidder-info.component';

describe('BidderInfoComponent', () => {
  let component: BidderInfoComponent;
  let fixture: ComponentFixture<BidderInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidderInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
