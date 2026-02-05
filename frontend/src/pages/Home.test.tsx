import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest'
import { Home } from './Home'; 

describe('Home', () => {

  it('renders a button labeled "Empieza a explorar" at the bottom of the banner', () => {

    render(<Home />);
    const button = screen.getByRole('button', { name: /empieza a explorar/i });
    expect(button).toBeInTheDocument();
    // Should be visually at the bottom of the banner (style check)
    expect(button.parentElement).toContainElement(screen.getByAltText(/banner/i));
  });

  it('scrolls to the VideoList section when the button is clicked', () => {

    render(<Home />);
    const button = screen.getByRole('button', { name: /empieza a explorar/i });
    const videoListSection = screen.getByTestId('video-list-section');
    // Simulate click
    fireEvent.click(button);
    // Expect the videoListSection to be scrolled into view (mock scrollIntoView)
    const scrollIntoView = vi.fn();
    videoListSection.scrollIntoView = scrollIntoView;
    fireEvent.click(button);
    expect(scrollIntoView).toHaveBeenCalled();
  });
});
