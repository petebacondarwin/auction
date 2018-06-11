import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { combineLatest, timer } from 'rxjs';
import { Item } from 'app/models';
import { Destroyable } from 'app/destroyable';
import { Storage } from 'app/storage.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  animations: [
      trigger('easeInOut', [
        transition(':enter', [
          style({
            opacity: 0
          }),
          animate('1s ease-in-out', style({
            opacity: 1
          }))
        ]),
        transition(':leave', [
          style({
            opacity: 1
          }),
          animate('1s ease-in-out', style({
            opacity: 0
          }))
        ])
      ])
  ]
})
export class LeaderboardComponent extends Destroyable implements OnInit {

  items: Observable<Item[]>;
  tick = timer(0, 10000);

  constructor(
    private storage: Storage,
  ) {
    super();
   }

  ngOnInit() {
    this.items = combineLatest(
      this.tick,
      this.storage.auctionItemsChanges,
      (seed, allItems) => getRandomSample(allItems, 4)
    );
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
