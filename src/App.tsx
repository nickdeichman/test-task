import React, { useEffect } from 'react';
import styles from './styles/app.module.css';
import { useFormulasStore } from './store/formulasStore';
import Button from '@mui/material/Button';
import Formula from './components/Formula';
import List from '@mui/material/List';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

function App() {
  const formulas = useFormulasStore((state) => state.formulas);
  const addFormula = useFormulasStore((state) => state.add);
  const handleAddFormula = () => {
    addFormula();
  };
  useEffect(() => {
    console.log(formulas);
    
  }, [formulas])
  return (
    <>
      <div className={styles['formulas_top']}>
        <>
          <span className={styles['formulas_amount']}>{`Formulas (${formulas.length})`}</span>
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
      <List>
        {formulas.length
          ? formulas.map((formula) => <Formula key={formula.id} {...formula} />)
          : null}
      </List>
      </QueryClientProvider>
    </>
  );
}

export default App;
