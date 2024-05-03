import React, { useState, SyntheticEvent, useEffect } from 'react';
import { IFormula } from '../entities/IFormula';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Chip } from '@mui/material';
import style from './../styles/app.module.css';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { IAutoCompleteItem } from '../entities/IAutoCompleteItem';

const Formula = ({ title, result, formula, id }: IFormula) => {
  const [titleState, setTitle] = useState(title);
  const [resultState, setResultState] = useState(result);
  const [inputValue, setInputValue] = useState('');
  const [chosenTags, setChosenTags] = useState<string[]>([]);

  const { isPending, error, data, isFetching } = useQuery<IAutoCompleteItem[]>({
    queryKey: ['repoData'],
    queryFn: () =>
      axios
        .get('https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete')
        .then((res) => res.data),
  });

  const handleTagChange = (
    event: SyntheticEvent<Element, Event>,
    newValue: string[]
  ) => {
    const temp = data?.filter((item) => item.name === newValue[newValue.length - 1])[0];
    setResultState(resultState + (temp?.value || 0))

    setChosenTags(newValue);
  };

  return (
    <li>
      <h4>{titleState}</h4>
      <p>{resultState}</p>
      <Autocomplete
        className={style['formula_input']}
        multiple
        id='tags-filled'
        options={data ? data.map((item) => `${item.name}`) : ['Loading...']}
        freeSolo
        clearIcon={false}
        onChange={handleTagChange}
        disableClearable
        renderTags={(value: readonly string[], getTagProps) =>
          value.map((option: string, index: number) => {
            if (option.trim().length === 0) return;
            const tagProps = getTagProps({ index });

            const { key, ...otherTagProps } = tagProps;
            console.log(option);

            return (
              <Chip
                sx={{ bgcolor: 'gray', color: '#eee' }}
                variant='outlined'
                label={option}
                key={key}
                {...otherTagProps}
              />
            );
          })
        }
        renderInput={(params) => <TextField {...params} variant='outlined' />}
      />
    </li>
  );
};

export default Formula;
