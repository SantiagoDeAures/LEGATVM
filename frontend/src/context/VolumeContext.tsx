import { createContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface VolumeContextType {
  volumeId: string | null;
  setVolumeId: (id: string | null) => void;
  chapterId: string | null;
  setchapterId: (id: string | null) => void;
}

const VolumeContext = createContext<VolumeContextType | undefined>(undefined);

function VolumeProvider({ children }: { children: ReactNode }) {
  const [volumeId, setVolumeId] = useState<string | null>(null);
  const [chapterId, setchapterId] = useState<string | null>(null);

  return (
    <VolumeContext.Provider value={{ volumeId, setVolumeId, chapterId, setchapterId }}>
      {children}
    </VolumeContext.Provider>
  );
}

export { VolumeContext, VolumeProvider };
