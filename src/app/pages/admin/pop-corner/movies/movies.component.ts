import { Component, inject, ViewChild } from '@angular/core';
import { SharedModule } from '~/app/shared/shared.module';
import { UiModule } from '~/app/shared/ui/ui.module';
import { MoviesService } from '~/app/core/services/pop-corner/movies.service';
import { ShTableAction } from '~/app/shared/components/table/table.types';
import { MatDialog } from '@angular/material/dialog';
import { MoviesImagesComponent } from './movies-images/movies-images.component';
import { EntityManagerComponent } from '~/app/shared/components/entity-manager/entity-manager.component';
import { PopCornerMovieModel } from '~/app/types/pop-corner';

@Component({
  selector: 'app-movies',
  imports: [UiModule, SharedModule],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss',
})
export class MoviesComponent {
  readonly dialog = inject(MatDialog);

  @ViewChild('entityRef', { static: false })
  entityRef!: EntityManagerComponent<PopCornerMovieModel>;
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
        onClick: (_, movieData) => {
          this.dialog
            .open(MoviesImagesComponent, {
              width: '80vw',
              data: {
                movieData,
                movieId: movieData.id,
              },
            })
            .afterClosed()
            .subscribe((res) => {
              if (res) this.entityRef?.fetchData();
            });
        },
      },
    ];
  }
}
