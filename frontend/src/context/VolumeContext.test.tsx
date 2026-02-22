import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { useContext } from 'react';
import { VolumeContext, VolumeProvider, VolumeContextType } from './VolumeContext';

function TestConsumer() {
  const context: VolumeContextType | undefined = useContext(VolumeContext);
  if (!context) return <div>No context</div>;

  return (
    <div>
      <span data-testid="volume-id">{context.volumeId ?? 'null'}</span>
      <button onClick={() => context.setVolumeId('vol-123')}>Set Volume</button>
      <button onClick={() => context.setVolumeId(null)}>Clear Volume</button>
    </div>
  );
}

describe('VolumeContext', () => {
  it('provides null as initial volumeId', () => {
    render(
      <VolumeProvider>
        <TestConsumer />
      </VolumeProvider>
    );

    expect(screen.getByTestId('volume-id')).toHaveTextContent('null');
  });

  it('updates volumeId when setVolumeId is called', () => {
    render(
      <VolumeProvider>
        <TestConsumer />
      </VolumeProvider>
    );

    fireEvent.click(screen.getByText('Set Volume'));

    expect(screen.getByTestId('volume-id')).toHaveTextContent('vol-123');
  });

  it('clears volumeId when setVolumeId is called with null', () => {
    render(
      <VolumeProvider>
        <TestConsumer />
      </VolumeProvider>
    );

    fireEvent.click(screen.getByText('Set Volume'));
    expect(screen.getByTestId('volume-id')).toHaveTextContent('vol-123');

    fireEvent.click(screen.getByText('Clear Volume'));
    expect(screen.getByTestId('volume-id')).toHaveTextContent('null');
  });
});
