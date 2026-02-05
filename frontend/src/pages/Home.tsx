import { useRef } from 'react';
import VolumeList from "../shared/components/VolumeList"
import type { Volume } from "../shared/types/volume";
import './Home.scss'

export const Home = () => {
  const videoListRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (videoListRef.current) {
      videoListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const volumeList: Volume[] = [
    {
      id: '1',
      title: 'Volume One',
      description: 'Description One',
      categories: ['Historia', 'Ciencia'],
      price: 10,
      thumbnail: 'image1.jpg',
    },
    {
      id: '2',
      title: 'Volume Two',
      description: 'Description Two',
      categories: ['Filosofía'],
      price: 20,
      thumbnail: 'image2.jpg',
    },
    {
      id: '3',
      title: 'Volume Three',
      description: 'Description Three',
      categories: ['Arte', 'Tecnología'],
      price: 30,
      thumbnail: 'image3.jpg',
    },
  ];

  return (
    <div className='home-container'>
      <div className='home-banner' >

        <button
        className='banner-button'
          onClick={handleScroll}
        >
          Empieza a explorar
        </button>
      </div>

      
      <div className="video-list-section" data-testid="video-list-section" ref={videoListRef}>
        <VolumeList volumes={volumeList}/>
      </div>
    </div>
  );
}