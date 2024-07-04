import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EditorComponent } from './components/editor/editor.component';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import { FormsModule } from '@angular/forms';

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
  title = 'web-editor';

  constructor() {
    hljs.registerLanguage('python', python);
  }
}
