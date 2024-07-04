import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showSpace',
  standalone: true
})
export class SpaceShowPipe implements PipeTransform {

  transform(code: string): unknown {
    const spaced = this.showSpace(code);
    return this.showTab(spaced);
  }

  showSpace(code: string): string {
    return code.replace(/ /g, '·')
  }

  showTab(code: string, tabWidth = 4): string {
    // for each line replace tab with spaces (respecting number of spaces in tab)
    return code.split('\n').map(line => {
      let result = '';
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '\t') {
          const spaces = tabWidth - (result.length % tabWidth);

          if (spaces > 1) {
            result += 'Ͱ' + '-'.repeat(spaces - 2);
            result += '→';
          } else {
            result += '→';
          }
        } else {
          result += line[i];
        }
      }
      return result;
    }).join('\n');
  }
}
