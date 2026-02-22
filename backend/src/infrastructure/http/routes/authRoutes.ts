import { Router } from 'express';
import { RegisterUser } from '../../../application/use-cases/RegisterUser';
import { LoginUser } from '../../../application/use-cases/LoginUser';
import { LogoutUser } from '../../../application/use-cases/LogoutUser';
import { RotateToken } from '../../../application/use-cases/RotateToken';

export function createAuthRouter(registerUser: RegisterUser, loginUser: LoginUser, logoutUser: LogoutUser, rotateToken: RotateToken): Router {
  const router = Router();

  router.post('/register', async (req, res) => {
    const result = await registerUser.execute(req.body);
    return res.status(result.status).json(result.body);
  });

  router.post('/login', async (req, res) => {
    const result = await loginUser.execute(req.body);
    if (result.status === 200) {
      const { refreshToken, ...restOfBody } = result.body

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        // secure: process.env.NODE_ENV === 'production',
        // sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })

      return res.status(result.status).json(restOfBody);
    }

    return res.status(result.status).json(result.body)

  });

  router.post('/logout', async (req, res) => {
    try {
      const { refreshToken } = req.cookies

      if (refreshToken) {
        await logoutUser.execute(refreshToken)
      }

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })

      return res.status(204).json({ message: 'Sección cerrada exitosamente' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(404).json({ message })
    }
  })

  router.post('/refresh', async (req, res) => {
    try {
      const { refreshToken } = req.cookies
      const result = await rotateToken.execute(refreshToken)
      return res.status(200).json({ result })


    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(404).json({ message })
    }
  })

  return router;
}
