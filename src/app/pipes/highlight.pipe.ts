import { Pipe, PipeTransform } from '@angular/core';
import hljs from 'highlight.js/lib/core';
import { Observable, of, switchMap } from 'rxjs';

@Pipe(
  {
    name: 'highlight',
    standalone: true
  }
)
export class HighlightPipe implements PipeTransform {

  transform(code: string, language: string): string {
    const highlightedCode = hljs.highlight(code, { language });
    return highlightedCode.value;
  }
}
