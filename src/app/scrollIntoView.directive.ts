import { Directive, ElementRef, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appScrollIntoView]'
})
export class ScrollIntoViewDirective implements OnChanges, AfterViewInit {
  @Input()
  appScrollIntoView: boolean;

  constructor(private element: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    const appScrollIntoView = changes.appScrollIntoView;
    if (appScrollIntoView.currentValue && !appScrollIntoView.previousValue && !appScrollIntoView.isFirstChange()) {
      if (!isScrolledIntoView(this.element.nativeElement)) {
        (this.element.nativeElement as Element).scrollIntoView(
          {block: 'center', behavior: 'smooth'}
        );
      }
    }
  }

  ngAfterViewInit() {
    if (this.appScrollIntoView) {
      setTimeout(() => (this.element.nativeElement as Element).scrollIntoView({block: 'center'}), 500);
   }
  }
}

function isScrolledIntoView(el) {
  const rect = el.getBoundingClientRect();
  const elemTop = rect.top;
  const elemBottom = rect.bottom;

  // Only completely visible elements return true:
  // var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);

  // Partially visible elements return true:
  return elemTop < window.innerHeight && elemBottom >= 0;
}
