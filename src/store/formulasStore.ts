import { create } from 'zustand';
import { IFormula } from '../entities/IFormula';

interface FormulasState {
  formulas: IFormula[];
  add: () => void;
  updateName: (id: number, newName: string) => void;
  updateResult: (id: number, newResult: number | string) => void;
}

export const useFormulasStore = create<FormulasState>()((set, get) => ({
  formulas: [],
  add: () => {
    const { formulas } = get();
    const newId =
      formulas.length > 0 ? Math.max(...formulas.map((f) => f.id)) + 1 : 1;
    const newTitleBase = 'New formula';
    let newTitle = newTitleBase;
    let counter = 1;

    while (formulas.some((f) => f.title === newTitle)) {
      newTitle = `${newTitleBase} (${counter})`;
      counter++;
    }

    set((state) => ({
      formulas: [
        ...state.formulas,
        {
          title: newTitle,
          result: 0,
          formula: [],
          id: newId,
        },
      ],
    }));
  },
  updateName: (id, newTitle) => {
    const { formulas } = get();
    let counter = 1;

    while (formulas.some((f) => f.title === newTitle)) {
      newTitle = `${newTitle} (${counter})`;
      counter++;
    }

    set((state) => ({
      formulas: state.formulas.map((item) =>
        item.id === id ? { ...item, title: newTitle } : item
      ),
    }))
  },
  updateResult: (id, newResult) => {
    set((state) => ({
      formulas: state.formulas.map((item) =>
        item.id === id ? { ...item, result: newResult } : item
      ),
    }))
  },
}));
