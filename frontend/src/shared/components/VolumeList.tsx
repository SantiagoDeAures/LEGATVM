import { useState } from 'react';
import type { Volume } from '../types/volume';
import './VolumeList.scss';

interface VolumeListProps {
  volumes: Volume[],
  showFilters?: boolean,
  handleCategoryList?: () => void
}

const CATEGORY_LIST = [
  'Todos',
  'Filosofía',
  'Ciencia',
  'Historia',
  'Arte',
  'Tecnología',
];

export default function VolumeList({
   volumes, 
   showFilters, 
   handleCategoryList
  }: VolumeListProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Todos']);
  const [search, setSearch] = useState('');

  const handleCategoryChange = (category: string) => {
    if (category === 'Todos') {
      setSelectedCategories(['Todos']);
    } else {
      let next = selectedCategories.filter((c) => c !== 'Todos');
      if (selectedCategories.includes(category)) {
        next = next.filter((c) => c !== category);
      } else {
        next = [...next, category];
      }
      if (next.length === 0) next = ['Todos'];
      setSelectedCategories(next);
    }
  };

  const filtered = volumes.filter((v) => {
    const matchesCategory =
      selectedCategories.includes('Todos') ||
      v.categories.some((cat) => selectedCategories.includes(cat));
    const matchesSearch = v.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });


  return (
    <div className="volume-list-container">
      <div className="volume-list-elements" >

        <div className='filters-container'>
          <input
            className='volume-search'
            placeholder="Buscar volumen"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className='filter-button' onClick={handleCategoryList}>Filtrar</button>
          {showFilters && (
            <div className='category-list'>
              {CATEGORY_LIST.map((cat) => (
                <label key={cat}>
                  <input
                    type="checkbox"
                    aria-label={cat}
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="volume-cards">
          {filtered.map((volume) => (
            <div key={volume.id} className="volume-card">
              <img src={volume.thumbnail} alt={volume.title} />
              <div>{volume.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
