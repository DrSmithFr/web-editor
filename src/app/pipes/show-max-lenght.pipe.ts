import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showMaxLength',
  standalone: true
})
export class showMaxLength implements PipeTransform {

  transform(code: string, max: number): string {
    const nbLines = code.split('\n').length;
    const result = [];

    for (let i = 0; i < nbLines; i++) {
      // generate max number of spaces
      const spaces = Array.from({ length: max }, () => ' ').join('');
      result.push(spaces + '│');
    }

    return result.join('\n');
  }

}
