import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SharedModule } from '~/app/shared/shared.module';
import { UiModule } from '~/app/shared/ui/ui.module';
@Component({
  selector: 'app-header',
  imports: [UiModule, SharedModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  appMode: 'light' | 'dark';

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.appMode =
      localStorage.getItem('appMode') === 'light' ? 'light' : 'dark';
  }

  ngOnInit(): void {
    this.saveMode();
  }

  toggleMode() {
    this.appMode = this.appMode === 'light' ? 'dark' : 'light';
    this.saveMode();
  }

  saveMode() {
    localStorage.setItem('appMode', this.appMode);
    const docEl = this.document.documentElement;
    const body = docEl ? docEl.querySelector('body') : null;
    if (body) {
      body.setAttribute('data-theme', this.appMode);
    }
  }
}
