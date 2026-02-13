import express from 'express';
import { User } from './shared/types/user';

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const users: Array<User> = [];

app.post('/api/auth/register', (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }
  // Check if user already exists
  if (users.some(u => u.email === email || u.username === username)) {
    return res.status(409).json({ message: 'Usuario o email ya existe' });
  }
  let id = String(users.length + 1)
  users.push({ id, email, username, password });
  return res.status(201).json({ message: 'Registro exitoso. Revisa tu correo para activar tu cuenta' });
});

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
