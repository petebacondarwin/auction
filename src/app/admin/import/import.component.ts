import { Component } from '@angular/core';

import { Subject } from 'rxjs/Subject';

import { WorkBook, read, utils } from 'xlsx';

import { Destroyable } from 'app/destroyable';
import { Item } from 'app/models';
import { Storage } from 'app/storage.service';

const COLUMN_FIELD_MAPPING = {
  'Class': undefined,
  'Type of donation P/L/N': undefined,
  'Blagger': undefined,
  'Donor': ['donor', 'name'],
  'Website': ['donor', 'website'],
  'Email': ['donor', 'email'],
  'Address': ['donor', 'address'],
  'Phone': ['donor', 'phone'],
  'Auction Lot Number': 'lot',
  'Title': 'title',
  'Long description': 'longDescription',
  'Short description': 'shortDescription',
  'Category': 'category',
  'Quantity': 'quantity',
  'Value': 'value',
  'Show Value': 'showValue',
  'Terms and conditions?': undefined,
  'Received donation?': undefined,
  'Location of prize?': undefined,
  'Image name': 'imageName'
};

const DEFAULTS = {
  'Image name': 'coleridge-logo.jpg',
  'Website': '',
};

const TRANSFORMS = {
  'Show Value': (value: string) => value.toLowerCase() === 'yes',
  'Long description': (value: string) => value.replace(/\n/g, '<br>'),
};

class ExcelFileReader extends FileReader {
  private _workbook = new Subject<WorkBook>();
  get workbook() { return this._workbook.asObservable(); }

  constructor() {
    super();
    this.onload = (e: Event) => this._workbook.next(read((e.target as any).result, {type: 'binary'}));
  }
}

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent extends Destroyable {

  workbook: WorkBook;
  selectedSheet: string;
  items: Item[];
  categories: string[];
  messages: string[] = [];

  private reader = new ExcelFileReader();

  constructor(private storage: Storage) {
    super();

    this.reader.workbook.pipe(this.takeUntilDestroyed()).subscribe(workbook => {
      this.log('workbook loaded');
      this.workbook = workbook;
      this.selectedSheet = null;
    });
  }



  onFileChange(evt: Event) {
    const upload: DataTransfer = evt.target as any;
    this.reader.readAsBinaryString(upload.files[0]);
  }

  selectSheet(sheetName: string) {
    this.selectedSheet = sheetName;
  }

  processSheet(sheetName: string) {
    if (!sheetName) {
      throw new Error('No sheet selected');
    }
    const data = utils.sheet_to_json(this.workbook.Sheets[sheetName], {blankrows: false, raw: true});
    const items: Item[] = data.map(convertToItem);
    this.log(items);
    this.items = items;

    const categories = { 'Raffle': true, 'Magic Box': true };
    this.items.forEach(item => { if (item.category) { categories[item.category] = true; } });
    this.categories = Object.keys(categories);
    this.log(Object.keys(categories));
  }

  async writeCategories() {
    await this.storage.deleteAllItems('categories');
    await this.storage.writeCategories(this.categories);
    this.log(`written ${this.categories.length} categories`);
  }

  async writeItems() {
    if (!this.items) {
      throw new Error('Nothing to write.');
    }

    this.writeCategories();

    await this.replaceItems('auction-items', this.items.filter(item => item.category !== 'Raffle' && item.category !== 'Magic Box'));
    await this.replaceItems('raffle-items', this.items.filter(item => item.category === 'Raffle'));
    await this.replaceItems('magic-box-items', this.items.filter(item => item.category === 'Magic Box'));
  }

  async replaceItems(collection: string, items: Item[]) {
    await this.storage.deleteAllItems(collection);
    this.log(`deleted previous ${collection}`);
    await this.storage.addItems(collection, items);
    this.log(`added ${items.length} new ${collection}`);
  }

  log(value) {
    this.messages.push(JSON.stringify(value));
  }
}


function convertToItem(row: any) {
  const item: Item = {} as any;
  Object.keys(COLUMN_FIELD_MAPPING).forEach(column => {
    // if there is no column and no default then ignore this column
    if (row[column] === undefined && DEFAULTS[column] === undefined) {
      return;
    }
    // otherwise get the value from the row or the default
    const rawValue = (row[column] === undefined) ? DEFAULTS[column] : row[column];
    // and then transform if necessary
    const value = TRANSFORMS[column] ? TRANSFORMS[column](rawValue) : rawValue;
    // parse the mapping to write th value to the property path on the item
    const mapping = COLUMN_FIELD_MAPPING[column];
    if (typeof mapping === 'string') {
      item[mapping] = value;
    } else if (Array.isArray(mapping)) {
      // expand the array into a property path
      let property = item;
      for (let i = 0; i < mapping.length - 1; i++) {
        const key = mapping[i];
        property = property[key] = property[key] || {};
      }
      property[mapping[mapping.length - 1]] = value;
    }
  });
  return item;
}
