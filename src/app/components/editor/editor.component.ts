import { AfterViewInit, Component, ElementRef, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HighlightPipe } from '../../pipes/highlight.pipe';
import { SpaceShowPipe } from '../../pipes/space-show.pipe';
import { CommonModule } from '@angular/common';
import { showMaxLength } from '../../pipes/show-max-lenght.pipe';

@Component(
  {
    selector: 'app-editor',
    imports: [
      CommonModule,
      FormsModule,
      HighlightPipe,
      SpaceShowPipe,
      showMaxLength
    ],
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => EditorComponent),
        multi: true,
      }
    ],
    standalone: true,
    templateUrl: './editor.component.html',
    styleUrl: './editor.component.scss'
  }
)
export class EditorComponent implements AfterViewInit, ControlValueAccessor {
  @ViewChild('editor') editor!: ElementRef<HTMLDivElement>;

  disabled = false;

  code = '';
  language = 'python';

  scrollTop = 0;
  scrollLeft = 0;

  width: number = 0;
  height: number = 0;

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

  // ControlValueAccessor implementation



  //Placeholders for the callbacks which are later providesd
  //by the Control Value Accessor
  // noop stands for No Operation
  noop = () => {};
  private onTouchedCallback: () => void = this.noop;
  private onChangeCallback: (_: any) => void = this.noop;

  writeValue(obj: string): void {
    if (!obj) {
      return;
    }

    if (obj === this.code) {
      return;
    }

    this.code = obj;
    this.onEditorScrollUpdate();
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
