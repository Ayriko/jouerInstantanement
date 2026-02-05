export class Pagination<T> {
  take: number = 10;
  page: number = 1;
  total!: number;
  items!: T[];
  hasNext!: boolean;
  hasPrevious!: boolean;
}
