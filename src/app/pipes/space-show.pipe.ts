import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showSpace',
  standalone: true
})
export class SpaceShowPipe implements PipeTransform {

  transform(code: string): unknown {
    return code.replace(/ /g, '·').replace(/\t/g, " -→ ");
  }
}
