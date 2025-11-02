import { Component } from '@angular/core';
import { SharedModule } from '~/app/shared/shared.module';
import { UiModule } from '~/app/shared/ui/ui.module';
import { MoviesService } from '~/app/core/services/pop-corner/movies.service';
import { ShTableAction } from '~/app/shared/components/table/table.types';

@Component({
  selector: 'app-movies',
  imports: [UiModule, SharedModule],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss',
})
export class MoviesComponent {
  constructor(public moviesSrv: MoviesService) {}

  get editFormField() {
    const hideFields = ['poster', 'imgFiles'];
    return this.moviesSrv.formFields.filter(
      (e) => !hideFields.includes(e.name),
    );
  }

  get tbExtraActions(): ShTableAction[] {
    return [
      {
        label: 'Change Image',
        icon: 'image',
        onClick(value) {},
      },
    ];
  }
}
