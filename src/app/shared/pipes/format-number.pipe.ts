import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'shFormatNumber' })
export class FormatNumberPipe implements PipeTransform {
  uniqueNumber(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
  }
  transform(
    value: number,
    options?: {
      fallback?: string | number;
      disableRound?: boolean;
      maxDecimalNumber?: number;
    }
  ): string | number {
    if (value === 0) return value;
    if (value) {
      if (options?.disableRound) {
        const truncatedValue = value.toLocaleString('en-US', {
          maximumFractionDigits: options?.maxDecimalNumber || 2,
        });
        return truncatedValue;
      }
      const truncatedValue = Math.round(value).toLocaleString('en-US');
      return truncatedValue;
    } else return String(options?.fallback || '');
  }
  transformDate(value: string): string {
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(value, 'd/M/yyyy, H:mm');
    return formattedDate || value;
  }
}
