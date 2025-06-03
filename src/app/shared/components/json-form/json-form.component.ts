import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { EditorView, basicSetup } from 'codemirror';
import { json } from '@codemirror/lang-json';

@Component({
  selector: 'app-json-form',
  standalone: false,
  templateUrl: './json-form.component.html',
  styleUrl: './json-form.component.scss',
})
export class JsonFormComponent implements AfterViewInit, OnChanges {
  @ViewChild('editorContainer', { static: true }) editorRef!: ElementRef;

  @Input() initValue: string = '';
  @Input() value: string = '';
  @Output() onValueChange = new EventEmitter<string>();

  private editorView!: EditorView;
  private isInitialized = false;

  ngAfterViewInit(): void {
    this.editorView = new EditorView({
      doc: this.initValue || '',
      extensions: [
        basicSetup,
        json(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const content = this.editorView.state.doc.toString();
            if (this.isValidJson(content)) {
              this.onValueChange.emit(content);
            }
          }
        }),
      ],
      parent: this.editorRef.nativeElement,
    });

    this.isInitialized = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && this.isInitialized) {
      const newValue = changes['value'].currentValue;
      const currentEditorContent = this.editorView.state.doc.toString();

      if (newValue !== currentEditorContent) {
        this.setEditorContent(newValue);
      }
    }
  }

  private setEditorContent(value: string) {
    const transaction = this.editorView.state.update({
      changes: {
        from: 0,
        to: this.editorView.state.doc.length,
        insert: value,
      },
    });
    this.editorView.dispatch(transaction);
  }

  private isValidJson(value: string): boolean {
    try {
      JSON.parse(value);
      return true;
    } catch {}
    return false;
  }
}
