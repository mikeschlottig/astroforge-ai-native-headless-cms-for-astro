import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
export type FieldType = 'text' | 'rich-text' | 'number' | 'date' | 'image' | 'boolean';
export interface CollectionField {
  id: string;
  type: FieldType;
  label: string;
  key: string;
  required?: boolean;
}
export interface Collection {
  id: string;
  name: string;
  description: string;
  icon: string;
  updatedAt: number;
  fields: CollectionField[];
}
export interface Entry {
  id: string;
  collectionId: string;
  data: Record<string, any>;
  updatedAt: number;
  status: 'draft' | 'published';
  author: string;
}
export interface MediaAsset {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
  altText?: string;
  updatedAt: number;
}
interface ForgeState {
  currentProject: string;
  isSidebarCollapsed: boolean;
  collections: Collection[];
  entries: Entry[];
  media: MediaAsset[];
  setProject: (name: string) => void;
  toggleSidebar: () => void;
  // CMS Actions
  addCollection: (collection: Omit<Collection, 'id' | 'updatedAt'>) => void;
  updateCollection: (id: string, collection: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  addEntry: (collectionId: string, data: Record<string, any>) => void;
  updateEntry: (id: string, data: Record<string, any>) => void;
  deleteEntry: (id: string) => void;
  // Media Actions
  addMedia: (asset: Omit<MediaAsset, 'id' | 'updatedAt'>) => void;
  deleteMedia: (id: string) => void;
  updateMediaAlt: (id: string, altText: string) => void;
}
export const useStore = create<ForgeState>()(
  immer((set) => ({
    currentProject: 'Vanguard Alpha',
    isSidebarCollapsed: false,
    collections: [
      {
        id: 'col-1',
        name: 'Blog Posts',
        description: 'Main articles and news updates for the primary site.',
        icon: 'FileText',
        updatedAt: Date.now(),
        fields: [
          { id: 'f1', type: 'text', label: 'Title', key: 'title', required: true },
          { id: 'f2', type: 'text', label: 'Slug', key: 'slug', required: true },
          { id: 'f3', type: 'rich-text', label: 'Content Body', key: 'content' },
          { id: 'f4', type: 'image', label: 'Featured Image', key: 'image' },
        ]
      },
      {
        id: 'col-2',
        name: 'Team Members',
        description: 'Directory of engineers and architects.',
        icon: 'User',
        updatedAt: Date.now(),
        fields: [
          { id: 'f5', type: 'text', label: 'Full Name', key: 'name' },
          { id: 'f6', type: 'text', label: 'Role', key: 'role' },
          { id: 'f7', type: 'image', label: 'Avatar', key: 'avatar' },
        ]
      }
    ],
    entries: [
      { 
        id: 'e1', 
        collectionId: 'col-1', 
        data: { title: 'Launching AstroForge', slug: 'launching-astroforge' }, 
        updatedAt: Date.now(),
        status: 'published',
        author: 'Architect Alpha'
      }
    ],
    media: [
      {
        id: 'm1',
        name: 'hero-banner.jpg',
        type: 'image/jpeg',
        size: '1.2 MB',
        url: 'https://images.unsplash.com/photo-1635830328409-4d31b016c731?q=80&w=2000&auto=format&fit=crop',
        altText: 'Abstract digital architecture with orange glow',
        updatedAt: Date.now()
      },
      {
        id: 'm2',
        name: 'island-diagram.svg',
        type: 'image/svg+xml',
        size: '45 KB',
        url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop',
        altText: 'Technical component nodes',
        updatedAt: Date.now()
      },
      {
        id: 'm3',
        name: 'team-avatar-1.png',
        type: 'image/png',
        size: '256 KB',
        url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop',
        altText: 'User profile placeholder',
        updatedAt: Date.now()
      }
    ],
    setProject: (name) => set((state) => { state.currentProject = name }),
    toggleSidebar: () => set((state) => { state.isSidebarCollapsed = !state.isSidebarCollapsed }),
    addCollection: (col) => set((state) => {
      state.collections.push({
        ...col,
        id: crypto.randomUUID(),
        updatedAt: Date.now()
      });
    }),
    updateCollection: (id, col) => set((state) => {
      const index = state.collections.findIndex(c => c.id === id);
      if (index !== -1) {
        state.collections[index] = { ...state.collections[index], ...col, updatedAt: Date.now() };
      }
    }),
    deleteCollection: (id) => set((state) => {
      state.collections = state.collections.filter(c => c.id !== id);
      state.entries = state.entries.filter(e => e.collectionId !== id);
    }),
    addEntry: (collectionId, data) => set((state) => {
      state.entries.push({
        id: crypto.randomUUID(),
        collectionId,
        data,
        updatedAt: Date.now(),
        status: 'draft',
        author: 'System'
      });
    }),
    updateEntry: (id, data) => set((state) => {
      const index = state.entries.findIndex(e => e.id === id);
      if (index !== -1) {
        state.entries[index].data = { ...state.entries[index].data, ...data };
        state.entries[index].updatedAt = Date.now();
      }
    }),
    deleteEntry: (id) => set((state) => {
      state.entries = state.entries.filter(e => e.id !== id);
    }),
    addMedia: (asset) => set((state) => {
      state.media.push({
        ...asset,
        id: crypto.randomUUID(),
        updatedAt: Date.now()
      });
    }),
    deleteMedia: (id) => set((state) => {
      state.media = state.media.filter(m => m.id !== id);
    }),
    updateMediaAlt: (id, altText) => set((state) => {
      const index = state.media.findIndex(m => m.id === id);
      if (index !== -1) {
        state.media[index].altText = altText;
        state.media[index].updatedAt = Date.now();
      }
    }),
  }))
);