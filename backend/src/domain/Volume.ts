export class Volume {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly categories: string[],
    public readonly price: number,
    public readonly thumbnail: string,
  ) {}
}
