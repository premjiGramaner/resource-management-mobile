import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
// import * as pdfFonts from "pdfmake/build/vfs_fonts";
// (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-export-option',
  templateUrl: './export-option.component.html',
  styleUrls: ['./export-option.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class ExportOptionComponent implements OnInit {
  @Input() exportData: any;
  unixTimestampInSeconds!: number;

  constructor(private modalCtrl: ModalController) {
    const unixTimestamp = Date.now(); // Returns the timestamp in milliseconds
    this.unixTimestampInSeconds = Math.floor(unixTimestamp / 1000);
  }
  ngOnInit() { }

  DownloadExcel() {
    console.log(this.exportData.pdfHeader, this.exportData.pdfData);
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
      // Custom header row
      this.exportData.pdfHeader,
      // Add data rows
      ...this.exportData.pdfData,
    ]);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Sheet');
    const excelBuffer: any = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(
      blob,
      `${this.exportData.filename}/${this.unixTimestampInSeconds}.xlsx`
    );
  }

  DownloadPDF() {
    const doc = new jsPDF({
      orientation: 'l',
      format: this.exportData.size || [500, 400], // Custom size in millimeters (width: 500mm, height: 400mm)
    });

    doc.setFontSize(10);
    doc.text(this.exportData.title || 'PDF Report', 10, 10);

    autoTable(doc, {
      theme: 'grid',
      head: [this.exportData.pdfHeader] || [],
      body: this.exportData.pdfData || [],
      headStyles: {
        fillColor: [128, 128, 128],
      },
      styles: {
        fontSize: 10,
        cellPadding: 1,
      },
    });

    doc.save(
      `${this.exportData.filename}/${this.unixTimestampInSeconds}` ||
      'report.pdf'
    );
  }

  dataToString(data: any) {
    let content = [];

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        content.push(`${key}: ${data[key]}`);
      }
    }

    return content;
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
