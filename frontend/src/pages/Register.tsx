import { useState } from 'react';
import { useNavigate } from 'react-router';
import NavBar from '../shared/components/NavBar';
import ResultModal from '../shared/components/ResultModal';
import { API_URL } from '../shared/constants/API_URL';


interface FormErrors {
    email?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
}

function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: string): boolean {
    return password.length > 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}

export const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [modal, setModal] = useState<{ result: 'success' | 'failure'; message: string } | null>(null);

    const validate = (): FormErrors => {
        const newErrors: FormErrors = {};

        if (!email.trim()) {
            newErrors.email = 'El correo electrónico es obligatorio';
        } else if (!validateEmail(email)) {
            newErrors.email = 'El correo electrónico no es válido';
        }

        if (!username.trim()) {
            newErrors.username = 'El nombre de usuario es obligatorio';
        }

        if (!password) {
            newErrors.password = 'La contraseña es obligatoria';
        } else if (!validatePassword(password)) {
            newErrors.password = 'La contraseña debe tener más de 8 caracteres, al menos una letra y al menos un número';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Debes confirmar la contraseña';
        } else if (password && confirmPassword && password !== confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        return newErrors;
    };

    const handleRegister = async () => {
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setModal({ result: 'success', message: data.message });
            } else {
                setModal({ result: 'failure', message: data.message });
            }
        } catch {
            setModal({ result: 'failure', message: 'Error de conexión con el servidor' });
        }
    };

    return (
        <>
            <NavBar />
            <h1>Register</h1>
            <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
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
                    <label htmlFor="username">Nombre de usuario</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
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

                <div>
                    <label htmlFor="confirmPassword">Confirmar contraseña</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword}</p>}
                </div>

                <button type="submit">Registrarme</button>
            </form>

            {modal && (
                <ResultModal
                    result={modal.result}
                    message={modal.message}
                    onClose={() => {
                        setModal(null);
                        if (modal.result === 'success') {
                            navigate('/login');
                        }
                    }}
                />
            )}
        </>
    );
}