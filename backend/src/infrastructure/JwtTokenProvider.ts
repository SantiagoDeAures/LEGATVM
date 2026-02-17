import dotenv from 'dotenv'
import jwt from'jsonwebtoken'
import { TokenProvider } from '../application/ports/TokenProvider'

dotenv.config()

export class JwtTokenProvider implements TokenProvider{
    private readonly secret = process.env.SECRET_KEY || 'secret'
    // verificar si está implementación es correcta

    generateAccessToken(userId: string): string {
        return jwt.sign({ userId }, this.secret, { expiresIn: '15m' })
    }

    generateRefreshToken(userId: string): string{
        return jwt.sign({ userId }, this.secret, { expiresIn: '7d' })
    }

    verify(token: string): string | object{
        return jwt.verify(token, this.secret)
    }
}