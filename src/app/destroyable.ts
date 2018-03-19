import { EventEmitter, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

export class Destroyable implements OnDestroy {
  protected onDestroy = new EventEmitter();

  ngOnDestroy() {
    this.onDestroy.emit();
  }

  protected takeUntilDestroyed<T>() {
    return takeUntil<T>(this.onDestroy);
  }
}