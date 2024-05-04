import React, { useState, SyntheticEvent, useEffect } from 'react';
import { IFormula } from '../entities/IFormula';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Chip } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import style from './../styles/app.module.css';
import { useQuery } from '@tanstack/react-query';
import { IAutoCompleteItem } from '../entities/IAutoCompleteItem';
import ListItem from '@mui/material/ListItem';
import { autocompleteData } from '../service/getData';
import useTags from '../hooks/useTags';
import { operands } from '../constants/constants';
import { useFormulasStore } from '../store/formulasStore';

const Formula = ({ title, result, formula, id }: IFormula) => {
  const [titleState, setTitleState] = useState(title);
  const [inputValue, setInputValue] = useState('');
  const updateFormula = useFormulasStore((state) => state.updateName);
  const [isEditing, setIsEditing] = useState(false);
  const { isPending, error, data, isFetching } = useQuery<IAutoCompleteItem[]>({
    queryKey: ['repoData'],
    queryFn: () => autocompleteData.get(),
  });
  const { handleTagChange, resultState, chosenTags } = useTags(data, result, id);

  useEffect(() => {
    setTitleState(title)
  }, [title])

  const handleInputChange = (
    event: SyntheticEvent<Element, Event>,
    newValue: string
  ) => {
    setInputValue(newValue);
    if (operands.includes(newValue.trim())) {
      handleTagChange(event, newValue.trim().split(''));
      setInputValue('');
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    updateFormula(id, titleState)
  };

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleState(event.target.value);
  };

  return (
    <ListItem className={style['list-item-flex']}>
      <Accordion id={style['accordion']}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1-content'
          id='panel1-header'
          className={style['formulas_item']}
        >
          <div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
          {isEditing ? (
            <TextField  className={style['formulas_item-name-input']} label="Standard" variant="standard"  onBlur={handleBlur} onChange={handleChange} value={titleState} autoFocus />
      ) : (
        <h4 onClick={handleClick} className={style['formulas_item-name']}>{titleState}</h4>

      )}
          <span className={style['formulas_item-result']}>{resultState}</span>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Autocomplete
            className={style['formula_input']}
            multiple
            value={chosenTags}
            inputValue={inputValue}
            id='tags-filled'
            loading={isPending}
            loadingText={'Loading...'}
            options={data ? data.map((item) => `${item.name}`) : []}
            freeSolo
            openOnFocus={false}
            clearIcon={false}
            onChange={handleTagChange}
            onInputChange={handleInputChange}
            disableClearable
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option: string, index: number) => {
                if (option.trim().length === 0) return '';

                const tagProps = getTagProps({ index });
                const { key, ...otherTagProps } = tagProps;
                return !operands.includes(option) ? (
                  <Chip
                    sx={{ bgcolor: 'gray', color: '#eee' }}
                    variant='outlined'
                    label={option}
                    key={key}
                    {...otherTagProps}
                  />
                ) : (
                  <Chip
                    sx={{ bgcolor: 'transparent' }}
                    label={`${option}`}
                    key={key}
                    {...otherTagProps}
                    onDelete={undefined}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField {...params} variant='outlined' />
            )}
          />
        </AccordionDetails>
      </Accordion>
    </ListItem>
  );
};

export default Formula;
