import { useEffect, useRef, useState } from 'react';
import VolumeList from "../shared/components/VolumeList"
import type { Volume } from "../shared/types/volume";
import './Home.scss'
import NavBar from '../shared/components/NavBar';
import { API_URL } from '../shared/constants/API_URL';

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

  const [volumeList, setVolumeList] = useState<Volume[]>([]);

  useEffect(() => {
    const fetchVolumes = async () => {
      try {
        const response = await fetch(`${API_URL}/api/volumes`);
        const json = await response.json();
        setVolumeList(json.data);
      } catch (error) {
        console.error('Error fetching volumes:', error);
      }
    };

    fetchVolumes();
  }, []);

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

  return (
    <div className='home-container' ref={homeContainerRef}>
      <NavBar />

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