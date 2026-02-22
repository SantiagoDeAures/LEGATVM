import { useAuth } from "../hooks/useAuth"
import NavBar from '../shared/components/NavBar';
import profileImage from '../assets/profile-icon.png'
import coinIcon from '../assets/coin-icon.png'

export const Profile = () => {

    const { user } = useAuth()

    return(
        <>
        <NavBar />
        <img src={profileImage} alt="profile" />
        <div>
            <div>
                <span>Nombre del Usuario</span>
                <p>{user?.username}</p>
            </div>
                        <div>
                <span>Correo electrónico</span>
                <p>{user?.email}</p>
            </div>
                        <div>
                <span>Moneda</span>
                <p>{user?.wallet.balance}</p>
                <img src={coinIcon} alt="coin" />
                <button>Recargar</button>
            </div>
        </div>
        </>
    )
}