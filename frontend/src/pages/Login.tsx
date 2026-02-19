import { useState } from 'react';
import { useNavigate } from 'react-router';
import NavBar from '../shared/components/NavBar';
import ResultModal from '../shared/components/ResultModal';
import { useAuth } from '../hooks/useAuth';

interface FormErrors {
    email?: string;
    password?: string;
}

export const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [modal, setModal] = useState<{ result: 'success' | 'failure'; message: string } | null>(null);

    const validate = (): FormErrors => {
        const newErrors: FormErrors = {};

        if (!email.trim()) {
            newErrors.email = 'Este campo es obligatorio';
        }

        if (!password) {
            newErrors.password = 'Este campo es obligatorio';
        }

        return newErrors;
    };

    const handleLogin = async () => {
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        const result = await login(email, password);

        if (result.success) {
            navigate('/');
        } else {
            setModal({ result: 'failure', message: result.message ?? 'Error al iniciar sesión' });
        }
    };

    return (
        <>
            <NavBar />
            <h1>Iniciar sesión</h1>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <div>
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        id="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                </div>

                <div>
                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                </div>

                <button type="submit">Iniciar sesión</button>
            </form>

            {modal && (
                <ResultModal
                    result={modal.result}
                    message={modal.message}
                    onClose={() => setModal(null)}
                />
            )}
        </>
    );
}