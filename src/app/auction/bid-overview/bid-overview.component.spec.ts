import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidOverviewComponent } from './bid-overview.component';

describe('BidOverviewComponent', () => {
  let component: BidOverviewComponent;
  let fixture: ComponentFixture<BidOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
