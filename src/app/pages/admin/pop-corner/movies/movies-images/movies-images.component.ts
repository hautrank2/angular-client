import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MoviesService } from '~/app/core/services/pop-corner/movies.service';
import { SharedModule } from '~/app/shared/shared.module';
import { UiModule } from '~/app/shared/ui/ui.module';
import { PopCornerMovieModel } from '~/app/types/pop-corner';
import { environment } from '~/environments/environment';

@Component({
  selector: 'app-movies-images',
  imports: [UiModule, SharedModule],
  templateUrl: './movies-images.component.html',
  styleUrl: './movies-images.component.scss',
})
export class MoviesImagesComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<MoviesImagesComponent>);
  movieData = signal<PopCornerMovieModel | null>(null);
  isChanged = signal(false);
  data: { movieId: string; movieData: PopCornerMovieModel } =
    inject(MAT_DIALOG_DATA);

  constructor(private movieSrv: MoviesService) {}

  ngOnInit(): void {
    if (this.data.movieData) {
      this.movieData.set(this.data.movieData);
    }
  }

  private onFetchData() {
    this.isChanged.set(true);
    this.movieSrv.findById(this.data.movieId).subscribe((res) => {
      this.movieData.set(res);
    });
  }

  // Emit ra ngoài khi posterUrl hoặc imgUrls thay đổi (optional nhưng nên có)
  @Output() changed = new EventEmitter<Partial<PopCornerMovieModel>>();

  uploadingPoster = false;
  uploadingImages = false;

  get movieId() {
    return this.data.movieId;
  }

  // local state để hiển thị ngay
  get posterUrl() {
    return this.movieData()?.posterUrl
      ? `${environment.popCornerUrl}${this.movieData()?.posterUrl}`
      : '';
  }

  get imgUrls(): string[] {
    const data = this.movieData();
    return data
      ? data.imgUrls.map((e) => `${environment.popCornerUrl}${e}`)
      : [];
  }

  // ===== Poster section =====
  onClickUploadPoster(input: HTMLInputElement) {
    input.value = ''; // reset để chọn lại cùng 1 file cũng trigger được
    input.click();
  }

  onPosterSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
      this.uploadingPoster = true;
      this.movieSrv.updatePoster(this.movieId, file).subscribe((res) => {
        this.onFetchData();
      });
    } catch (err) {
      console.error('Upload poster error', err);
      // TODO: show toast
    } finally {
      this.uploadingPoster = false;
    }
  }

  // ===== Images section =====
  onClickUploadImages(input: HTMLInputElement) {
    input.value = '';
    input.click();
  }

  onImagesSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (files.length === 0) return;
    this.movieSrv.addImage(this.movieId, files).subscribe(() => {
      this.onFetchData();
    });
  }

  onRemoveImage(imgIndex: number) {
    this.movieSrv.removeImgsByIndex(this.movieId, imgIndex).subscribe(() => {
      this.onFetchData();
    });
  }

  close() {
    this.dialogRef.close(this.isChanged());
  }
}
