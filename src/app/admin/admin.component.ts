import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { WorkBook, WorkSheet, read, utils } from 'xlsx';

import { Destroyable } from 'app/destroyable';
import { Category, Item } from 'app/models';
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
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent extends Destroyable {

  workbook: WorkBook;
  selectedSheet: string;
  messages: string[];

  private reader = new ExcelFileReader();

  constructor(private storage: Storage) {
    super();

    this.reader.workbook.pipe(this.takeUntilDestroyed()).subscribe(workbook => {
      console.log('workbook loaded');
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
    this.processSheet(utils.sheet_to_json(this.workbook.Sheets[sheetName], {blankrows: false, raw: true}));
  }

  async processSheet(data: any[]) {
    const items: Item[] = data.map(convertToItem);
    console.log(items);

    await this.storage.deleteAllAuctionItems();
    console.log('deleted previous auction items')
    await this.storage.addAuctionItems(items.filter(item => item.category !== 'Raffle' && item.category !== 'Magic Box'));
    console.log('added new auction items');
  }
}


class ExcelFileReader extends FileReader {
  private _workbook = new Subject<WorkBook>();
  get workbook() { return this._workbook.asObservable(); }

  constructor() {
    super();
    this.onload = (e: Event) => this._workbook.next(read((e.target as any).result, {type: 'binary'}));
  }
}

function convertToItem(row: any) {
  const item: Item = {} as any;
  Object.keys(row).forEach(column => {
    const value = row[column];
    const mapping = COLUMN_FIELD_MAPPING[column];
    if (typeof mapping === 'string') {
      item[mapping] = value;
    } else if (Array.isArray(mapping)) {
      // expand the array into a property path
      let property = item;
      for(let i = 0; i < mapping.length - 1; i++) {
        const key = mapping[i];
        property = property[key] = property[key] || {};
      }
      property[mapping[mapping.length-1]] = value;
    }
  });
  return item;
}
