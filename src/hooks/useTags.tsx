import React, { SyntheticEvent, useEffect, useState } from 'react';
import { IAutoCompleteItem } from '../entities/IAutoCompleteItem';
import { operands } from '../constants/constants';
import { useFormulasStore } from '../store/formulasStore';

const useTags = (data: IAutoCompleteItem[] = [], result: number | string, id: number) => {
  const [resultState, setResultState] = useState(result);
  const [chosenTags, setChosenTags] = useState<string[]>([]);
  const [parenthesesValues, setParenthesesValues] = useState<
    (string | number)[]
  >([]);
  const updateFormulasResult = useFormulasStore((state) => state.updateResult);


  useEffect(() => {
    updateFormulasResult(id, resultState)
  }, [resultState])
  const handleTagChange = (
    event: SyntheticEvent<Element, Event>,
    newValue: string[]
  ) => {
    let stack = [...chosenTags];
    let currentNumber: number | string | undefined;
    const lastItem = newValue[newValue.length - 1];
    const item = data?.find((item) => item.name === lastItem);
    if (item) {
      currentNumber = item.value;
      if (typeof currentNumber === 'string') {
        currentNumber = eval(currentNumber) // just for working with expressions in value
      }

      if (parenthesesValues.length > 0) {
        setParenthesesValues((prevState) => [...prevState, lastItem]);
        const tempArr = operands.includes(newValue[0])
          ? [...chosenTags, newValue[0]]
          : newValue;
        setChosenTags(tempArr);
        return;
      }
    } else if (operands.includes(lastItem)) {
      if (lastItem === '(') {
        setParenthesesValues((prevState) => [...prevState, lastItem]);
        const tempArr = operands.includes(newValue[0])
          ? [...chosenTags, newValue[0]]
          : newValue;
        setChosenTags(tempArr);
        return;
      } else {
        stack.push(lastItem);

        while (stack.length !== 0) {
          currentNumber = applyOperation(
            String(stack.pop()),
            String(stack.pop()),
            Number(currentNumber)
          );
        }

        if (currentNumber !== undefined) stack.push(currentNumber.toString());

        stack.push(lastItem);
        currentNumber = undefined;
      }
    }

    while (stack.length !== 0) {
      currentNumber = applyOperation(
        String(stack.pop()),
        String(stack.pop()),
        Number(currentNumber)
      );
    }
    const tempArr = operands.includes(newValue[0])
      ? [...chosenTags, newValue[0]]
      : newValue;
    setChosenTags(tempArr);

    if (newValue[0] !== ')' && operands.includes(newValue[0])) return;
    if (
      currentNumber !== undefined &&
      typeof currentNumber === 'number' &&
      !isNaN(currentNumber)
    ) {
      setResultState(currentNumber);
    } else {
      setResultState('#Error!');
    }
  };

  const applyOperation = (
    operation: string,
    number1Str: string,
    number2Str: number | string
  ) => {
    let number1 = data?.find((item) => item.name === number1Str)?.value;
    number1 = typeof number1 === 'string' ? parseInt(eval(number1))  : number1;
    let number2 =
      typeof number2Str === 'string' ? eval(number2Str) : number2Str;

    if (number1 !== undefined && !isNaN(number1)) {
      switch (operation) {
        case '+':
          return number1 + number2;
        case '-':
          return number1 - number2;
        case '*':
          return number1 * number2;
        case '/':
          return number1 / number2;
          case '^': 
          return number1 ^ number2;
        default:
          return number2 ? number2 : 0;
      }
    }
    return number2;
  };
  return { handleTagChange, resultState, chosenTags };
};

export default useTags;
