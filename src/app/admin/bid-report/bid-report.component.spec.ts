import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidReportComponent } from './bid-report.component';

describe('BidReportComponent', () => {
  let component: BidReportComponent;
  let fixture: ComponentFixture<BidReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
