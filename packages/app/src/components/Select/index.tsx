import React from 'react';
import { forwardRef, useId } from 'react';
import { ComponentPropsWithoutRef } from 'react';
import Label from '../Label';

type dataSourceValue = {
  value: string;
};

type SelectProps = ComponentPropsWithoutRef<'select'> & {
  label?: string;
  error?: string;
  dataSourceGroup: dataSourceValue[];
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, dataSourceGroup, ...props }, ref) => {
    const id = useId();
    return (
      <>
        {label && (
          <Label
            htmlFor={id}
            className={classNames(error ? '!text-red-500' : '')}
          >
            {label}
          </Label>
        )}
        <select
          className={classNames(
            error ? '!border-red-500' : '',
            className ? className : '',
          )}
          ref={ref}
          {...props}
        >
          <option value="" selected disabled hidden>
            {props.placeholder || 'Select'}
          </option>
          {dataSourceGroup.map((source) => (
            <option key={source.value} id={id} spellCheck="false">
              {source.value}
            </option>
          ))}
        </select>
        {error && (
          // peer-focus:hidden
          <span className="text-red-500 text-sm ">{error}</span>
        )}
      </>
    );
  },
);
