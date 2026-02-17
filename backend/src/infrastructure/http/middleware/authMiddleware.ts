import { Request, Response, NextFunction } from 'express';
import { TokenProvider } from '../../../application/ports/TokenProvider';

const PUBLIC_PATHS = [
  '/api/auth/register',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/refresh',
];

export function createAuthMiddleware(tokenProvider: TokenProvider) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (PUBLIC_PATHS.includes(req.path)) {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Token de acceso requerido' });
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = tokenProvider.verify(token);
      (req as any).userId = (payload as { userId: string }).userId;
      next();
    } catch {
      res.status(401).json({ message: 'Token de acceso inválido o expirado' });
    }
  };
}
