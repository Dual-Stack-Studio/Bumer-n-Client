import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@bumeran/favoritos';

interface FavoritosContextValue {
  favoritos: string[];
  esFavorito: (favorId: string) => boolean;
  toggleFavorito: (favorId: string) => void;
}

const FavoritosContext = createContext<FavoritosContextValue | undefined>(undefined);

export function FavoritosProvider({ children }: { children: React.ReactNode }) {
  const [favoritos, setFavoritos] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value) setFavoritos(JSON.parse(value));
    });
  }, []);

  const toggleFavorito = useCallback((favorId: string) => {
    setFavoritos((prev) => {
      const next = prev.includes(favorId)
        ? prev.filter((id) => id !== favorId)
        : [...prev, favorId];

      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const esFavorito = useCallback((favorId: string) => favoritos.includes(favorId), [favoritos]);

  return (
    <FavoritosContext.Provider value={{ favoritos, esFavorito, toggleFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos() {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error('useFavoritos debe usarse dentro de un FavoritosProvider');
  }
  return context;
}
