import React from 'react';
import styles from './styles/app.module.css';
import { useFormulasStore } from './store/formulasStore';
import Button from '@mui/material/Button';
import Formula from './components/Formula';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

function App() {
  const formulas = useFormulasStore((state) => state.formulas);
  const addFormula = useFormulasStore((state) => state.add);
  const handleAddFormula = () => {
    addFormula();
  };
  return (
    <>
      <div>
        <>
          <span>{`Formulas (${formulas.length})`}</span>
          <Button
            className={styles.add_formula_btn}
            size='small'
            onClick={handleAddFormula}
            variant='contained'
          >
            +
          </Button>
        </>
      </div>
      <QueryClientProvider client={queryClient}>
      <ul>
        {formulas.length
          ? formulas.map((formula) => <Formula key={formula.id} {...formula} />)
          : null}
      </ul>
      </QueryClientProvider>
    </>
  );
}

export default App;
