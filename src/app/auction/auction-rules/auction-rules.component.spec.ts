import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionRulesComponent } from './auction-rules.component';

describe('AuctionRulesComponent', () => {
  let component: AuctionRulesComponent;
  let fixture: ComponentFixture<AuctionRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuctionRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
