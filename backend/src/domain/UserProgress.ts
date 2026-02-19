export class UserProgress {
  constructor(
    public readonly userId: string,
    public readonly chapterId: string,
    public readonly isCompleted: boolean = false,
  ) {}
}
