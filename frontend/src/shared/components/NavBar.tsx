import { NavLink, useLocation } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import './NavBar.scss'
import logo from '../../assets/logo-icon-1.png'
import coinIcon from '../../assets/coin-icon.png'
import profileIcon from '../../assets/profile-icon.png'
import { useState } from 'react';

export default function NavBar() {
  const { user, logout } = useAuth();
  // const user = {
  //   username: 'Santiago de Aures',
  //   wallet: {
  //     balance: 800
  //   }
  // }
  const location = useLocation();
  const isAbout = location.pathname === '/about';
  const isLogin = location.pathname === '/login';
  const isRegister = location.pathname === '/register';

  const [showProfileOptions, setshowProfileOptions] = useState(false)

  if (!user) {
    return (
      <nav className='nav-container'>

        <figure className='image-logo-container'>
          <NavLink
            to="/"
          >
            <img src={logo} alt="Logo de LEGATVM" className='image-logo' />
          </NavLink>
        </figure>
        <div className='menu-container'>
          <NavLink
            to="/about"
            className='menu-item'
            style={isAbout ? { borderBottom: '2px solid #FFDC50' } : undefined}
          >
            Acerca de LEGATVM
          </NavLink>
          <NavLink
            to="/login"
            className='menu-item'
            style={isLogin ? { borderBottom: '2px solid #FFDC50' } : undefined}
          >
            Iniciar sesión
          </NavLink>
          <NavLink
            to="/register"
            className='menu-item'
            style={isRegister ? { borderBottom: '2px solid #FFDC50' } : undefined}
          >
            Registrarse
          </NavLink>
        </div>
      </nav>
    );
  }

  return (
    <nav className='nav-container'>
      <figure className='image-logo-container'>
        <NavLink
          to="/"
        >
          <img src={logo} alt="Logo de LEGATVM" className='image-logo' />
        </NavLink>
      </figure>

      <div className='menu-container'>
        <NavLink
          to="/about"
          className='menu-item'
          style={isAbout ? { borderBottom: '2px solid #FFDC50' } : undefined}
        >
          Acerca de LEGATVM
        </NavLink>
        <div className='coin-container'>
          <img src={coinIcon} alt="Coin icon" className='coin-icon' />
          <input className='balance-input' type="text" value={user?.wallet.balance} readOnly />
        </div>
        <div className='profile-container' onClick={() => setshowProfileOptions(prev => !prev)}>
          <img src={profileIcon} alt="profile icon" className='profile-icon' />
          <span className='menu-item'>{user?.username}</span>
          {
            showProfileOptions &&
            <div className='profile-options'>
              <a className='profile-option-item' href="#" >Mi perfil</a>
              <a className='profile-option-item' href="#">Mis volúmenes</a>
              <a className='profile-option-item' onClick={logout}>Cerrar sesión</a>
            </div>
          }



        </div>

      </div>

    </nav>
  );
}
