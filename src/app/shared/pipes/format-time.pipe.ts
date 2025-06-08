import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'shFormatTime' })
@Injectable({
  providedIn: 'root', // hoặc bỏ đi nếu bạn muốn dùng trong module cụ thể
})
export class FormatTimePipe implements PipeTransform {
  transform(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const secondsRemainder = seconds % 60;
    const minutesRemainder = minutes % 60;
    const hoursRemainder = hours % 24;

    const parts: string[] = [];

    if (days > 0) {
      parts.push(`${days}d`);
    }
    if (hoursRemainder > 0) {
      parts.push(`${hoursRemainder}h`);
    }
    if (minutesRemainder > 0) {
      parts.push(`${minutesRemainder}m`);
    }
    if (secondsRemainder > 0) {
      parts.push(`${secondsRemainder}s`);
    }

    return parts.join(' ') || '0s'; // Return "0s" if no time is present
  }
}
