import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HighlightPipe } from '../../pipes/highlight.pipe';
import { SpaceShowPipe } from '../../pipes/space-show.pipe';
import { CommonModule } from '@angular/common';

@Component(
  {
    selector: 'app-editor',
    imports: [
      CommonModule,
      FormsModule,
      HighlightPipe,
      SpaceShowPipe
    ],
    standalone: true,
    templateUrl: './editor.component.html',
    styleUrl: './editor.component.scss'
  }
)
export class EditorComponent implements AfterViewInit {
  @ViewChild('editor') editor!: ElementRef<HTMLDivElement>;

  code = '';
  language = 'python';

  scrollTop = 0;
  scrollLeft = 0;

  ngAfterViewInit() {
    this.editor.nativeElement.focus();
    this.onEditorScrollUpdate();
  }

  onEditorScrollUpdate() {
    const scrollTop = this.editor.nativeElement.scrollTop;
    let scrollLeft = this.editor.nativeElement.scrollLeft;

    console.log('scrollLeft', scrollLeft);

    const scrollLeftOffset = 50;
    scrollLeft -= scrollLeftOffset;

    setTimeout(() => {
      this.scrollTop = -scrollTop;
      this.scrollLeft = -scrollLeft;
    });
  }

  getLinesNumber(code: string): number[] {
    const nbLines = code.split('\n').length;
    return Array.from({ length: nbLines }, (_, i) => i + 1);
  }

  onCodeChange() {
    console.log('code changed');
  }
}
