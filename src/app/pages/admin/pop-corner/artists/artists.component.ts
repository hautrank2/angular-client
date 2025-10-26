import { Component } from '@angular/core';
import { ArtistService } from '~/app/core/services/pop-corner/artist.service';
import { SharedModule } from '~/app/shared/shared.module';
import { UiModule } from '~/app/shared/ui/ui.module';

@Component({
  selector: 'app-artists',
  imports: [SharedModule, UiModule],
  templateUrl: './artists.component.html',
  styleUrl: './artists.component.scss',
})
export class ArtistsComponent {
  constructor(public artistSrv: ArtistService) {}
}
