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

    const uniqueIds = new Set();
    return array.filter((item) => {
      if (!uniqueIds.has(item.skill_id)) {
        uniqueIds.add(item.skill_id);
        return true;
      }
      return false;
    });
  }
}
