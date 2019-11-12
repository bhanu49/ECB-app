import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBool'
})
export class FilterBoolPipe implements PipeTransform {

  transform(objects: any[]): any[] {
    if (objects) {
      return objects.filter(object => {
        if (!object.locked) {
          return object;
        }
      });
    }
  }

}
