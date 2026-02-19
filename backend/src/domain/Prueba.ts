export class Option {
  constructor(
    public readonly id: string,
    public readonly text: string,
  ) {}
}

export class Question {
  constructor(
    public readonly id: string,
    public readonly question: string,
    public readonly options: Option[],
    public readonly correctOptionIds: string[],
  ) {}
}

export class Prueba {
  constructor(
    public readonly id: string,
    public readonly volumeId: string,
    public readonly chapterId: string,
    public readonly questions: Question[],
  ) {}
}
