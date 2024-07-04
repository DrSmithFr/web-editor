import { AfterViewInit, Component, ElementRef, forwardRef, Input, ViewChild } from '@angular/core';
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
  @ViewChild('editor') editor!: ElementRef<HTMLTextAreaElement>;

  @Input() language    = 'python';
  @Input() disabled    = false;
  @Input() placeholder = '';

  @Input() width  = '100%';
  @Input() height = '100%';

  @Input() set code(code: string) {
    this._code = code;
  }

  protected _code = '';
  protected _code_history: string[] = [];

  selectionStart = 0;
  selectionEnd   = 0;

  scrollTop  = 0;
  scrollLeft = 50;

  ngAfterViewInit() {
    const editor = this.editor.nativeElement;

    if (!editor) {
      console.error('Editor not found');
      return;
    }

    editor.focus();

    editor.addEventListener('keydown', this.onKeyDown.bind(this));
    editor.addEventListener('keyup', this.onKeyUp.bind(this));
    editor.addEventListener('scroll', this.onEditorScrollUpdate.bind(this));

    // follow caret position and selection
    editor.addEventListener('keypress', this.onCaretsChange.bind(this)); // Every character written
    editor.addEventListener('mousedown', this.onCaretsChange.bind(this)); // Click down
    editor.addEventListener('touchstart', this.onCaretsChange.bind(this)); // Mobile
    editor.addEventListener('input', this.onCaretsChange.bind(this)); // Other input events
    editor.addEventListener('paste', this.onCaretsChange.bind(this)); // Clipboard actions
    editor.addEventListener('cut', this.onCaretsChange.bind(this));
    editor.addEventListener('mousemove', this.onCaretsChange.bind(this)); // Selection, dragging text
    editor.addEventListener('select', this.onCaretsChange.bind(this)); // Some browsers support this event
    editor.addEventListener('selectstart', this.onCaretsChange.bind(this)); // Some browsers support this event
    editor.addEventListener('selectionchange', this.onCaretsChange.bind(this));
  }

  onEditorScrollUpdate() {
    const scrollTop = this.editor.nativeElement.scrollTop;
    let scrollLeft  = this.editor.nativeElement.scrollLeft;

    const scrollLeftOffset = 50;
    scrollLeft -= scrollLeftOffset;

    setTimeout(() => {
      this.scrollTop  = -scrollTop;
      this.scrollLeft = -scrollLeft;
    });
  }

  onKeyDown(e: KeyboardEvent) {

    if (e.key == 'z' && e.ctrlKey) {
      e.preventDefault();

      if (this._code_history.length > 1) {
        this._code_history.pop();
        this._code = this._code_history[this._code_history.length - 1];
        this.onChangeCallback(this._code);
      }
    }

    if (e.key == 'Tab') {
      e.preventDefault();

      const editor = this.editor.nativeElement;
      const startSelection = editor.selectionStart;

      this._code_history.push(editor.value);

      editor.setRangeText(
        "\t",
        startSelection,
        editor.selectionEnd,
        "end"
      );

      const newCaretPosition = startSelection + 1;

      setTimeout(() => {
        this._code = editor.value;
        editor.setSelectionRange(newCaretPosition, newCaretPosition);
        this.onEditorScrollUpdate();
      });
    }
  }

  onKeyUp(e: KeyboardEvent) {
    if (['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'].includes(e.key)) {
      e.preventDefault();
      this.onCaretsChange(e)
    }
  }

  onCaretsChange(
    e: Event
  ) {
    const editor        = this.editor.nativeElement;

    if (this.selectionStart === editor.selectionStart && this.selectionEnd === editor.selectionEnd) {
      return;
    }

    this.selectionStart = editor.selectionStart || 0;
    this.selectionEnd   = editor.selectionEnd || 0;

    console.log(`{ ${this.selectionStart} : ${this.selectionEnd} }`)
  }

  getLinesNumber(code: string): number[] {
    const nbLines = code.split('\n').length;
    return Array.from({length: nbLines}, (_, i) => i + 1);
  }

  // ControlValueAccessor implementation

  //Placeholders for the callbacks which are later providesd
  //by the Control Value Accessor
  // noop stands for No Operation
  noop                                       = () => {
  };
  private onTouchedCallback: () => void      = this.noop;
  private onChangeCallback: (_: any) => void = this.noop;

  writeValue(obj: string): void {
    if (!obj) {
      return;
    }

    if (obj === this._code) {
      return;
    }

    this._code = obj;
    this._code_history.push(obj);
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
