import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { StaticDataConstants } from 'src/app/core/constant/staticData.constants';
import { CustomDropDownData, DropdownEvent } from 'src/app/core/base-model/base.model';

@Component({
  selector: 'app-searchable-dropdown',
  templateUrl: './searchable-dropdown.component.html',
  styleUrls: ['./searchable-dropdown.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, SelectDropDownModule, ReactiveFormsModule, FormsModule],
  encapsulation: ViewEncapsulation.None
})
export class SearchableDropdownComponent implements OnInit, OnChanges {

  @Input() dropDownData !: CustomDropDownData;
  @Input() selectedData !: string;
  @Output() dropDownEvent = new EventEmitter<string>;

  dropDownConfig = this.staticDataConstants.dropDownConfig;
  selectedEventData!: string;
  public searchTerm = '';
  public OriginalArray: string[] = [];
  constructor(
    private staticDataConstants: StaticDataConstants
  ) { }

  ngOnInit() {

  }

  ngOnChanges() {
    this.dropDownConfig['displayKey'] = this.dropDownData.displayKey;
    this.dropDownConfig['placeholder'] = this.dropDownData.placeholder;
    this.dropDownConfig['searchOnKey'] = this.dropDownData.searchOnKey;
    this.selectedEventData = this.selectedData;
  }

  selectedEvent(event: any) {
    event as DropdownEvent;
    this.dropDownEvent.emit(event)
  }
}
