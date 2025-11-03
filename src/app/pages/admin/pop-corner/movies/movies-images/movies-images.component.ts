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

  data: { movieId: string; movieData: PopCornerMovieModel } =
    inject(MAT_DIALOG_DATA);

  constructor(private movieSrv: MoviesService) {}

  ngOnInit(): void {
    if (this.data.movieData) {
      this.movieData.set(this.data.movieData);
    }
  }

  private onFetchData() {
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
  async onClickUploadPoster(input: HTMLInputElement) {
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

  async onImagesSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (files.length === 0) return;

    this.uploadingImages = true;
    try {
      // Upload tuần tự (đơn giản). Nếu muốn nhanh hơn có thể Promise.all kèm giới hạn concurrency.
      const newUrls: string[] = [];
      for (const f of files) {
        // TODO: gọi API upload image – TRẢ VỀ URL ảnh
        // const url = await this.movieService.uploadImage(this.movieData.id, f).toPromise();
        const url = await this.mockUpload(f); // <- tạm mock
        newUrls.push(url);
      }
      // this.imgUrls = [...this.imgUrls, ...newUrls];
    } catch (err) {
      console.error('Upload images error', err);
      // TODO: show toast
    } finally {
      this.uploadingImages = false;
    }
  }

  async onRemoveImage(url: string) {
    try {
      // TODO: gọi API xóa ảnh nếu cần:
      // await this.movieService.deleteImage(this.movieData.id, url).toPromise();
      // this.imgUrls = this.imgUrls.filter((u) => u !== url);
    } catch (err) {
      console.error('Delete image error', err);
      // TODO: show toast
    }
  }

  close() {
    this.dialogRef.close(this.movieData);
  }

  // ----- MOCK upload (demo) -----
  private async mockUpload(file: File): Promise<string> {
    await new Promise((r) => setTimeout(r, 600));
    // Trả về object URL để demo. Khi tích hợp API thực, trả về URL từ server.
    return URL.createObjectURL(file);
  }
}
