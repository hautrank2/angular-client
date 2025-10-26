import { Component } from '@angular/core';
import { SharedModule } from '~/app/shared/shared.module';
import { UiModule } from '~/app/shared/ui/ui.module';
import { MoviesService } from '../../../../core/services/pop-corner/movies.service';

@Component({
  selector: 'app-movies',
  imports: [UiModule, SharedModule],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss',
})
export class MoviesComponent {
  constructor(public moviesSrv: MoviesService) {}
}
