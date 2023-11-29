import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateformatConverter'
})
export class DateformatConverterPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) { }
  transform(value: string): unknown {
    const [day, month, year] = value.split('/');
    const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    if (!isNaN(date.getTime())) {
      const formattedDate = this.datePipe.transform(date, 'yyyy/MM/dd');
      return formattedDate || '';
    } else {
      console.error('Invalid date:', value);
      return '';
    }
  }

}
