import { Directive, ElementRef, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[app-scroll-into-view-on]'
})
export class ScrollIntoViewDirective implements OnChanges, AfterViewInit {
  @Input('app-scroll-into-view-on')
  trigger: boolean;

  constructor(private element: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    const trigger = changes.trigger;
    if (trigger.currentValue && !trigger.previousValue && !trigger.isFirstChange()) {
      (this.element.nativeElement as Element).scrollIntoView(
        {block: 'center', behavior: 'smooth'}
      );
    }
  }

  ngAfterViewInit() {
    if (this.trigger) {
      (this.element.nativeElement as Element).scrollIntoView({block: 'center'});
   }
  }
}