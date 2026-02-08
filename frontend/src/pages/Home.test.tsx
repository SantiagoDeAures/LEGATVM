import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { Home } from './Home'; 

describe('Home', () => {
  
  beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = function () {};
});

  it('renders a button labeled "Empieza a explorar" at the bottom of the banner', () => {

    render(<Home />);
    const button = screen.getByRole('button', { name: /empieza a explorar/i });
    expect(button).toBeInTheDocument();
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
