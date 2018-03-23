import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidCountComponent } from './bid-count.component';

describe('BidCountComponent', () => {
  let component: BidCountComponent;
  let fixture: ComponentFixture<BidCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
