import { useState } from 'react';
import { useNavigate } from 'react-router';
import NavBar from '../shared/components/NavBar';
import ResultModal from '../shared/components/ResultModal';
import { useAuth } from '../hooks/useAuth';
import LoginImage from '../assets/login-image.png'
import './Login.scss'

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
            <div className='login-container'>
                <NavBar />
                <div className='login-section-container'>
                    <img src={LoginImage} alt="login image" className='login-image'/>
                    <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className='login-form'>
                    <div className='login-field'>
                        <label htmlFor="email" className='login-label'>Correo electrónico</label>
                        <input
                            id="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='login-input'
                        />
                        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                    </div>

                    <div className='login-field'>
                        <label htmlFor="password" className='login-label'>Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='login-input'
                        />
                        {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                    </div>

                    <button type="submit" className='login-button'>Iniciar sesión</button>
                </form>
                </div>

                {modal && (
                    <ResultModal
                        result={modal.result}
                        message={modal.message}
                        onClose={() => setModal(null)}
                    />
                )}
            </div>
        </>
    );
}