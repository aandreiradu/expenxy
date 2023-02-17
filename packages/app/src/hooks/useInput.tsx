import React, { ChangeEvent, useCallback, useState } from 'react';

interface UseInputProps {
  validator(value: string): boolean;
}

const useInput = (validator: UseInputProps) => {
  const [value, setValue] = useState<string>();
  const [isTouched, setIsTouched] = useState<boolean>(false);

  const changeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  const blurHandler = useCallback(() => {
    setIsTouched(true);
  }, []);

  const resetHandler = useCallback(() => {
    setValue('');
    setIsTouched(false);
  }, []);

  let isValid;
  if (value && typeof validator !== 'undefined') {
    // isValid = validator(value);
  }
  const hasError = !isValid && isTouched;

  return {
    changeHandler,
    blurHandler,
    value,
    hasError,
    resetHandler,
  };
};

export default useInput;
