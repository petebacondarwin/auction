import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Destroyable } from 'app/destroyable';
import { Storage } from 'app/storage.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  animations: [
    trigger('easeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class LeaderboardComponent extends Destroyable {

  // Create a timer based on the value given in the "t" query param.
  tick = this.route.queryParamMap.pipe(
    switchMap(params => timer(0, Number(params.get('t') || 6) * 1000))
  );
  allItems = this.storage.auctionItemsChanges;
  items = combineLatest(
    this.route.queryParamMap,
    this.allItems,
    this.tick,
    (params, allItems) => getRandomSample(allItems, Number(params.get('n') || 4))
  );

  constructor(private storage: Storage, private route: ActivatedRoute) {
    super();
  }
}


function getRandom(length) {
  return Math.floor(Math.random() * (length));
}

function getRandomSample(array, size) {
  const length = array.length;
  for (let i = size; i--;) {
      const index = getRandom(length);
      const temp = array[index];
      array[index] = array[i];
      array[i] = temp;
  }
  return array.slice(0, size);
}
