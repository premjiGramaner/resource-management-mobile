import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duplicateRemover',
  standalone: true,
})
export class DuplicateRemoverPipe implements PipeTransform {
  transform(array: any[]): any[] {
    if (!Array.isArray(array)) {
      return array;
    }
    const seen = new Set();
    return array.filter((item) => {
      const serializedItem = JSON.stringify(item);
      if (seen.has(serializedItem)) {
        return false;
      }
      seen.add(serializedItem);
      return true;
    });
  }
}
