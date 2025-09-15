import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ShColumn } from '~/app/shared/components/table/table.types';
import { SharedModule } from '~/app/shared/shared.module';
import { UiModule } from '~/app/shared/ui/ui.module';
import { jsonValidator, TABLE_COLUMNS } from './showcase-table.data';
import { ApiFakerService } from '~/app/core/services/api-faker.service';
import {
  API_REPONSE_BASE,
  ApiPaginationQuery,
  PaginationResponse,
} from '~/app/types/query';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EditorView, basicSetup } from 'codemirror';
import { json } from '@codemirror/lang-json';

@Component({
  selector: 'app-showcase-table',
  imports: [SharedModule, UiModule],
  templateUrl: './showcase-table.component.html',
  styleUrl: './showcase-table.component.scss',
})
export class ShowcaseTableComponent implements OnInit, AfterViewInit {
  columns = signal<ShColumn<any>[]>([]);
  data = signal<PaginationResponse<any>>(API_REPONSE_BASE);
  filters = signal<ApiPaginationQuery>({ page: 1, pageSize: 10 });
  formGroup = new FormGroup({});

  //#region START: Table
  tbSelect = signal(true);
  tbIsForm = signal(false);
  //#endregion

  //#region START: JSON FORM
  @ViewChild('columnsEditor', { static: true }) editorRef!: ElementRef;
  isInitializedColumnForm = false;
  columnControl = new FormControl('', [Validators.required, jsonValidator()]);
  private editorView!: EditorView;
  //#endregion END JSON FORM

  readonly apiEndpoint: string = '/data/users.json';
  constructor(private apiFakerSrv: ApiFakerService<any>) {
    effect(() => {
      console.log('columns', this.columns());
    });
  }

  ngOnInit(): void {
    this.columns.set(TABLE_COLUMNS);

    this.apiFakerSrv.find(this.apiEndpoint, this.filters()).subscribe((res) => {
      this.data.set(res);
    });
  }

  ngAfterViewInit(): void {
    this.initEditorContent();
  }

  changeColumns() {
    try {
      if (this.columnControl.valid && this.columnControl.value) {
        const value = JSON.parse(this.columnControl.value) as ShColumn<any>[];
        this.columns.set([...value]);
      }
    } catch (err) {
      console.log(err);
    }
  }

  get columnJson() {
    return JSON.stringify(this.columns(), null, 2);
  }

  get defaultDisplayColumns() {
    return this.columns().map((e) => e.key);
  }

  //#region JSON form
  private initEditorContent() {
    this.editorView = new EditorView({
      doc: this.columnJson,
      extensions: [
        basicSetup,
        json(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const content = this.editorView.state.doc.toString();
            this.columnControl.setValue(content);
            this.columnControl.markAsDirty();
          }
        }),
      ],
      parent: this.editorRef.nativeElement,
    });
    this.isInitializedColumnForm = true;
  }
}
