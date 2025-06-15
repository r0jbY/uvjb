import { create } from 'zustand';        

type Store = {
  hasUnsaved: boolean;
  setHasUnsaved: (v: boolean) => void;
};

export const useUnsavedStore = create<Store>((set) => ({
  hasUnsaved: false,
  setHasUnsaved: (v) => set({ hasUnsaved: v }),
}));
