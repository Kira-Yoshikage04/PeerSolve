import React, { createContext, useState, ReactNode } from 'react';
import NewDoubtModal from '../components/NewDoubtModal';

type ModalType = 'newDoubt' | null;

interface ModalContextType {
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const openModal = (modal: ModalType) => setActiveModal(modal);
  const closeModal = () => setActiveModal(null);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {activeModal === 'newDoubt' && <NewDoubtModal onClose={closeModal} />}
    </ModalContext.Provider>
  );
};