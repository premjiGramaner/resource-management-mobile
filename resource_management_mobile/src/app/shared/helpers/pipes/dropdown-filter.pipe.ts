import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dropdownFilters'
})
export class DropdownFilterPipe implements PipeTransform {
  data: any
  transform(value: string, items: Array<string>): unknown {
    if (!items || !value) {
      return items;
    }
    return items.filter(item =>
      item.toLowerCase().includes(value.toLowerCase())
    );
  }

}
