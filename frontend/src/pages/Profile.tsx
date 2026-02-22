import { useAuth } from "../hooks/useAuth"
import NavBar from '../shared/components/NavBar';
import profileImage from '../assets/profile-icon.png'
import coinIcon from '../assets/coin-icon.png'
import './Profile.scss'
import { useState } from "react";
import { DesigningModal } from "../shared/components/DesigningModal";

export const Profile = () => {

    const { user } = useAuth()
    const [modal, setModal] = useState <boolean>(false);

    return (
        <>
            <div className="profile-details-container">
                <NavBar />
                <div className="profile-details-content">
                    <figure className="profile-icon-container">
                        <img src={profileImage} alt="profile" className="profile-icon-information" />
                    </figure>

                    <div className="profile-information-container">
                        <div className="profile-field-container">
                            <span className="profile-field-label">Nombre de Usuario:</span>
                            <p className="profile-field-content">{user?.username}</p>
                        </div>
                        <div className="profile-field-container">
                            <span className="profile-field-label">Correo electrónico:</span>
                            <p className="profile-field-content">{user?.email}</p>
                        </div>
                        <div className="profile-field-container">
                            <span className="profile-field-label">Cartera:</span>
                            <p className="profile-field-content">{user?.wallet.balance}</p>
                            <img className="profile-coin-icon" src={coinIcon} alt="coin" />
                            <button className="profile-recharge-button" onClick={() => setModal(true)}>Recargar</button>
                        </div>
                    </div>
                </div>
            </div>

            {
                modal && 

                <DesigningModal onClose={() => setModal(false)} />
            }
        </>
    )
}