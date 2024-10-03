import React, {
  createContext,
  Dispatch,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  useContext,
} from "react";
import { RapierRigidBody } from "@react-three/rapier";

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
  streak: number;
  setStreak: Dispatch<SetStateAction<number>>;
  rotation: [number, number, number];
  ballRef: MutableRefObject<RapierRigidBody | null>;
  resetGame: () => void;
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
  streak: number;
  setStreak: Dispatch<SetStateAction<number>>;
  rotation: [number, number, number];
  ballRef: MutableRefObject<RapierRigidBody | null>;
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
  streak,
  setStreak,
  rotation,
  ballRef,
}) => {
  const resetGame = () => {
    setScore(0);
    setPreScore(0);
    setNumJumps(0);
    setStreak(0);
  };

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
        streak,
        setStreak,
        rotation,
        ballRef,
        resetGame,
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
