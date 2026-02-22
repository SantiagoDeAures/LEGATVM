import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest'
import { type ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import VolumeList from './VolumeList'; 
import { Volume } from '../types/volume';
import { AuthContext } from '../../context/AuthContext';

const mockAuthValue = {
  user: { id: 'user-uuid-1', username: 'Ana Developer', email: 'ana@test.com',  wallet: { balance: 1000 } },
  isAuthenticated: true,
  accessToken: 'fake-access-token',
  login: vi.fn(),
  logout: vi.fn(),
};

function renderWithProviders(ui: ReactNode) {
  return render(
    <AuthContext.Provider value={mockAuthValue}>
      <MemoryRouter>{ui}</MemoryRouter>
    </AuthContext.Provider>
  );
}

describe('VolumeList', () => {
  const mockVolumes: Volume[] = [
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

  const categories = [
    'Todos',
    'Filosofía',
    'Ciencia',
    'Historia',
    'Arte',
    'Tecnología',
  ];

  it('renders a list of volume cards with image and title', () => {
    
    renderWithProviders(<VolumeList volumes={mockVolumes} />);

    mockVolumes.forEach((volume) => {
      expect(screen.getByText(volume.title)).toBeInTheDocument();
      expect(screen.getByAltText(volume.title)).toHaveAttribute('src', volume.thumbnail);
    });
  });

  it('renders a filter button that shows a category list with checkboxes', () => {
  
    renderWithProviders(<VolumeList volumes={mockVolumes} showFilters={true} handleCategoryList={() => {}} />);

    const filterButton = screen.getByRole('button', { name: /filtrar/i });
    expect(filterButton).toBeInTheDocument();

    categories.forEach((category) => {
      expect(screen.getByLabelText(category)).toBeInTheDocument();
      expect(screen.getByLabelText(category)).toHaveAttribute('type', 'checkbox');
    });
  });

  it('filters volumes by selected categories', () => {

    renderWithProviders(<VolumeList volumes={mockVolumes} showFilters={true} handleCategoryList={() => {}} />);

    // Select "Filosofía" category
    const filosofiaCheckbox = screen.getByLabelText('Filosofía');
    fireEvent.click(filosofiaCheckbox);

    // Only the volume with Filosofía should be visible
    expect(screen.getByText('Volume Two')).toBeInTheDocument();
    expect(screen.queryByText('Volume One')).not.toBeInTheDocument();
    expect(screen.queryByText('Volume Three')).not.toBeInTheDocument();

    // Select "Arte" category as well
    const arteCheckbox = screen.getByLabelText('Arte');
    fireEvent.click(arteCheckbox);

    // Now both "Volume Two" and "Volume Three" should be visible
    expect(screen.getByText('Volume Two')).toBeInTheDocument();
    expect(screen.getByText('Volume Three')).toBeInTheDocument();
    expect(screen.queryByText('Volume One')).not.toBeInTheDocument();

    // Unselect all and select "Todos"
    fireEvent.click(filosofiaCheckbox); // Unselect Filosofía
    fireEvent.click(arteCheckbox); // Unselect Arte
    const todosCheckbox = screen.getByLabelText('Todos');
    fireEvent.click(todosCheckbox);

    // All volumes should be visible
    expect(screen.getByText('Volume One')).toBeInTheDocument();
    expect(screen.getByText('Volume Two')).toBeInTheDocument();
    expect(screen.getByText('Volume Three')).toBeInTheDocument();
  });

  it('filters volumes by search bar input', () => {

    renderWithProviders(<VolumeList volumes={mockVolumes} />);

    const searchInput = screen.getByPlaceholderText(/buscar volumen/i);
    expect(searchInput).toBeInTheDocument();

    // Type "Volume Two" in the search bar
    fireEvent.change(searchInput, { target: { value: 'Volume Two' } });

    // Only "Volume Two" should be visible
    expect(screen.getByText('Volume Two')).toBeInTheDocument();
    expect(screen.queryByText('Volume One')).not.toBeInTheDocument();
    expect(screen.queryByText('Volume Three')).not.toBeInTheDocument();

    // Clear search, all volumes should be visible again
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByText('Volume One')).toBeInTheDocument();
    expect(screen.getByText('Volume Two')).toBeInTheDocument();
    expect(screen.getByText('Volume Three')).toBeInTheDocument();
  });
});
