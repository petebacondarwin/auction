import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WinningBidsComponent } from './winning-bids.component';

describe('WinningBidsComponent', () => {
  let component: WinningBidsComponent;
  let fixture: ComponentFixture<WinningBidsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WinningBidsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WinningBidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
