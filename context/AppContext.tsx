import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
} from "react";

interface AppContextType {
  isModalOpen: boolean;
  isPaused: boolean;
  modalText: string;
  setModalText: Dispatch<SetStateAction<string>>;
  openModal: ({ text }: { text: string }) => void;
  closeModal: () => void;
  preScore: number;
  setPreScore: Dispatch<SetStateAction<number>>;
  score: number;
  setScore: Dispatch<SetStateAction<number>>;
  numJumps: number;
  setNumJumps: Dispatch<SetStateAction<number>>;
  rotation: [number, number, number];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
  isModalOpen: boolean;
  isPaused: boolean;
  modalText: string;
  setModalText: Dispatch<SetStateAction<string>>;
  openModal: ({ text }: { text: string }) => void;
  closeModal: () => void;
  preScore: number;
  setPreScore: Dispatch<SetStateAction<number>>;
  score: number;
  setScore: Dispatch<SetStateAction<number>>;
  numJumps: number;
  setNumJumps: Dispatch<SetStateAction<number>>;
  rotation: [number, number, number];
}

export const AppProvider: React.FC<AppProviderProps> = ({
  isModalOpen,
  isPaused,
  modalText,
  setModalText,
  children,
  openModal,
  closeModal,
  preScore,
  setPreScore,
  score,
  setScore,
  numJumps,
  setNumJumps,
  rotation,
}) => {
  return (
    <AppContext.Provider
      value={{
        isModalOpen,
        isPaused,
        modalText,
        setModalText,
        openModal,
        closeModal,
        preScore,
        setPreScore,
        score,
        setScore,
        numJumps,
        setNumJumps,
        rotation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
