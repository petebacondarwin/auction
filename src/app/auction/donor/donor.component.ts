import { Component, Input } from '@angular/core';
import { Donor } from 'app/models';

@Component({
  selector: 'app-donor',
  templateUrl: './donor.component.html',
  styleUrls: ['./donor.component.css']
})
export class DonorComponent  {
  @Input()
  donor: Donor;

  get websiteUrl() {
    return /^https?:\/\//.test(this.donor.website) ? this.donor.website : `http://${this.donor.website}`;
  }
}
