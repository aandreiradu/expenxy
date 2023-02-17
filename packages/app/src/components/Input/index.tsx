import { forwardRef, useId } from 'react';
import { ComponentPropsWithoutRef } from 'react';
import Label from '../Label';

type InputProps = ComponentPropsWithoutRef<'input'> & {
  label?: string;
  error?: string;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, type, error, className, ...props }, ref) => {
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
        <input
          className={classNames(
            error ? '!border-red-500' : '',
            className ? className : '',
          )}
          ref={ref}
          id={id}
          type={type || 'text'}
          spellCheck="false"
          {...props}
        />
        {error && (
          // peer-focus:hidden
          <span className="text-red-500 text-sm ">{error}</span>
        )}
      </>
    );
  },
);

Input.displayName = 'Input';
