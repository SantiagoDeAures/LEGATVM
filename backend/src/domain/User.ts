import bcrypt from 'bcrypt'

export class User {
    constructor(
        public readonly id: string,
        public readonly username: string,
        public readonly email: string,
        private _password: string
    ){}

    public static async create(id: string, username: string, email: string, password: string): Promise<User>{
        const hashedPassword = await bcrypt.hash(password, 10)
        return new User(id, username, email, hashedPassword)
    }

    public async passwordMatches(passwordInput: string): Promise<boolean>{
        const isMatch = await bcrypt.compare(passwordInput, this._password)
        return isMatch
    }

    static fromPersistence(data: any): User {
        return new User(data.id, data.username, data.email, data.password);
    }
}