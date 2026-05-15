import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ToolsState {
  favorites: string[]
  history: string[]
  toggleFavorite: (toolId: string) => void
  addToHistory: (toolId: string) => void
  clearHistory: () => void
}

export const useToolsStore = create<ToolsState>()(
  persist(
    (set) => ({
      favorites: [],
      history: [],
      toggleFavorite: (toolId) =>
        set((state) => ({
          favorites: state.favorites.includes(toolId)
            ? state.favorites.filter((id) => id !== toolId)
            : [...state.favorites, toolId],
        })),
      addToHistory: (toolId) =>
        set((state) => ({
          history: [toolId, ...state.history.filter((id) => id !== toolId)].slice(0, 10),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "nextools-storage",
    }
  )
)
