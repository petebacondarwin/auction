import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MagicBoxComponent } from './magic-box.component';

describe('MagicBoxComponent', () => {
  let component: MagicBoxComponent;
  let fixture: ComponentFixture<MagicBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagicBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagicBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
