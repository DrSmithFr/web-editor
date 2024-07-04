import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EditorComponent } from './components/editor/editor.component';
import { FormsModule } from '@angular/forms';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';

@Component(
  {
    selector: 'app-root',
    standalone: true,
    imports: [
      RouterOutlet,
      EditorComponent,
      FormsModule
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
  })
export class AppComponent {
  code = "def add(a, b):\n\treturn a + b\n\nreturn add(1, 2)\n";

  constructor() {
    hljs.registerLanguage('python', python);
  }
}
