import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lineSep'
})
export class LineSepPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value === 'stream') {
      return 'Horizontal Line Separation';
    }  else if (value === 'lattice') {
      return 'Vertical Line Separation';
    }
  }

}
