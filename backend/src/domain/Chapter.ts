export class Chapter {
  constructor(
    public readonly id: string,
    public readonly volumeId: string,
    public readonly title: string,
    public readonly type: string,
    public readonly contentUrl: string,
  ) {}
}
