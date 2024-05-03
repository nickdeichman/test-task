import { create } from 'zustand';
import { IFormula } from '../entities/IFormula';

interface FormulasState {
  formulas: IFormula[];
  add: () => void;
  delete: (title: string) => void;
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
  delete: (title) =>
    set((state) => ({
      formulas: [...state.formulas.filter((item) => item.title !== title)],
    })),
}));
