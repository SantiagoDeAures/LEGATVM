import { useState } from 'react';
import type { Volume } from '../types/volume';
import './VolumeList.scss';

interface VolumeListProps {
  volumes: Volume[];
}

const CATEGORY_LIST = [
  'Todos',
  'Filosofía',
  'Ciencia',
  'Historia',
  'Arte',
  'Tecnología',
];

export default function VolumeList({ volumes }: VolumeListProps) {
  const [showFilters, setShowFilters] = useState(false);
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
      <input
        placeholder="Buscar volumen"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={() => setShowFilters((s) => !s)}>Filtrar</button>
      {showFilters && (
        <div className="category-list">
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
      <div className="volume-cards">
        {filtered.map((volume) => (
          <div key={volume.id} className="volume-card">
            <img src={volume.thumbnail} alt={volume.title} />
            <div>{volume.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
