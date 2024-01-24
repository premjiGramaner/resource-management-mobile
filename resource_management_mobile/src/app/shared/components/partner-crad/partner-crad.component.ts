import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { partnerData } from 'src/app/pages/partner/models/partner.model';
import { partner } from 'src/app/pages/requirement/models/requirement.model';
import { DateformatConverterPipe } from '../../helpers/pipes/dateformat-converter.pipe';
import { SearchableDropdownComponent } from '../searchable-dropdown/searchable-dropdown.component';
import { CustomDropDownData } from 'src/app/core/base-model/base.model';
import { ToastConstants } from 'src/app/core/constant/toast.message.constant';

@Component({
  selector: 'app-partner-crad',
  templateUrl: './partner-crad.component.html',
  styleUrls: ['./partner-crad.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, SearchableDropdownComponent]
})
export class PartnerCradComponent implements OnInit, OnChanges {

  @Input() partnerList!: partnerData[];
  partnerDropDownData!: CustomDropDownData;
  addform!: FormGroup;
  @Output() addPartner = new EventEmitter<partner>();
  constructor(
    private modalController: ModalController,
    private datePipe: DatePipe,
    private dateformatConverterPipe: DateformatConverterPipe,
    private toastConstants: ToastConstants,) { }

  ngOnInit() {
    this.partnerDropDownData = {
      title: this.toastConstants.select_partner_placeholder,
      data: [],
      config: {
        displayKey: 'name',
        placeholder: this.toastConstants.select_partner_placeholder,
        searchOnKey: 'name',
        search: true,
      },
    };
    this.addform = new FormGroup({
      partner_id: new FormControl('', Validators.required),
      shared_on: new FormControl('', Validators.required)
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.partnerDropDownData.data = this.partnerList as []
  }
  setClose() {
    this.modalController.dismiss();
  }

  onSubmit(form: FormGroup) {
    if (form.valid) {
      form.patchValue({
        shared_on: this.dateformatConverterPipe.transform(
          form.value.shared_on
        ) as string
      })
      this.addPartner.emit(form.value);
      this.modalController.dismiss();
    } else {
      this.addform.markAllAsTouched();
    }
  }

  /**
   * 
   * @param event carry the date properties
   */
  evaluatedDate(event: any) {
    this.addform.patchValue({
      shared_on: this.datePipe.transform(event.detail.value, 'dd/MM/yyyy')
    })
    this.setClose();
  }

  partnerSelectedEvent(event: any) {
    this.addform.patchValue({
      partner_id: event.value.partner_id
    })
  }
}
