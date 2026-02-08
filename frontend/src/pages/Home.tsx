import { useEffect, useRef, useState } from 'react';
import VolumeList from "../shared/components/VolumeList"
import type { Volume } from "../shared/types/volume";
import './Home.scss'

export const Home = () => {
  const videoListRef = useRef<HTMLDivElement>(null);
    const homeContainerRef = useRef<HTMLDivElement>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleScroll = () => {
    if (videoListRef.current) {
      videoListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryList = () => {
    setShowFilters((s) => !s)
  }

useEffect(() => {
  const container = homeContainerRef.current;
  if (!container) return;

  const hideCategoryList = () => {
    setShowFilters(false);
  };

  container.addEventListener('scroll', hideCategoryList);

  return () => {
    container.removeEventListener('scroll', hideCategoryList);
  };
}, []);


  const volumeList: Volume[] = [
    {
      id: '1',
      title: 'The Prince',
      description: 'Description One',
      categories: ['Historia', 'Ciencia'],
      price: 10,
      thumbnail: '../src/assets/ThePrince.png',
    },
    {
      id: '2',
      title: 'The IA Story',
      description: 'Description Two',
      categories: ['Filosofía'],
      price: 20,
      thumbnail: '../src/assets/TheIAStory.png',
    },
    {
      id: '3',
      title: 'The Republic',
      description: 'Description Three',
      categories: ['Arte', 'Tecnología'],
      price: 30,
      thumbnail: '../src/assets/TheRepublic.png',
    },
  ];

  return (
    <div className='home-container' ref={homeContainerRef}>
      <div className='home-banner' >

        <video autoPlay muted loop className="background-video">
          <source src='../src/assets/banner-LEGATVM12.mp4' type='video/mp4' />
        </video>

        <button
        className='banner-button'
          onClick={handleScroll}
        >
          Empieza a explorar
        </button>

        <div className='phrase-container'>
          <p>"En algún sitio algo increíble espera ser descubierto."</p>
          <p>- Carl Sagan</p>
        </div>
      </div>

      
      <div className="video-list-section" data-testid="video-list-section" ref={videoListRef}>
        <VolumeList volumes={volumeList} handleCategoryList={handleCategoryList} showFilters ={showFilters}/>
      </div>
    </div>
  );
}