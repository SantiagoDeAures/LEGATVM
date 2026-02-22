import NavBar from '../shared/components/NavBar';
import AboutImage from '../assets/about-image.png'
import ContactImage from '../assets/contact-image.png'
import envelopeIcon from '../assets/envelope.svg'
import telephoneIcon from '../assets/telephone.svg'
import './About.scss'

export const About = () => {

    return (
        <>
            <div className='about-container'>
                <NavBar />
                <section className='about-description-container'>
                    <img src={AboutImage} alt="About image" className='about-image'/>
                    <p className='about-description'>LEGATVM se dedica a la creación de contenido digital interactivo y espacios virtuales para el conocimiento y la cultura. Nace a raíz del legado invaluable dejado por nuestros antepasados, a partir del cual se crean aventuras inmersivas basadas en grandes obras. Estas experiencias buscan solventar el vacío dejado por una educación ineficiente, formando individuos capaces de pensar por sí mismos de forma crítica, o mediante viajes narrativos para comprender el mundo que nos rodea.</p>
                </section>
                <section className='about-contact-container'>
                    <img src={ContactImage} alt="contact image" className='contact-image'/>
                    <div className='information-contact-container'>
                        <p className='contact-description'>Y si estás interesado en trabajar con nosotros y crees en el poder de las herramientas digitales para la educación y el aprendizaje puedes contactarnos: </p>
                        <div className='information-contact'>
                            <img src={envelopeIcon} alt="envelope icon" className='information-contact-icon'/>
                            <p className='information-contact-text'>legatvm.contact@gmail.com</p>
                        </div>
                        <div className='information-contact'>
                            <img src={telephoneIcon} alt="telephone icon" className='information-contact-icon' />
                            <p className='information-contact-text'>+573137242546</p>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}