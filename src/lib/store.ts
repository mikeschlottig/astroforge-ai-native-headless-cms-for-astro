import { create } from 'zustand';
interface ForgeState {
  currentProject: string;
  isSidebarCollapsed: boolean;
  setProject: (name: string) => void;
  toggleSidebar: () => void;
}
export const useStore = create<ForgeState>((set) => ({
  currentProject: 'Vanguard Alpha',
  isSidebarCollapsed: false,
  setProject: (name) => set({ currentProject: name }),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}));