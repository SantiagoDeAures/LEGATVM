import VolumeList from "../shared/components/VolumeList"
import type { Volume } from "../shared/types/volume";

export const Home = () => {
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

    return(
        <VolumeList volumes={volumeList}/>
    )
}