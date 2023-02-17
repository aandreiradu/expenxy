import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react';

type LabelProps = Omit<ComponentPropsWithoutRef<'label'>, 'children'> & {
  children: ReactNode;
};

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ htmlFor, className, children, ...props }, ref) => {
    return (
      <label ref={ref} htmlFor={htmlFor} className={className} {...props}>
        {children}
      </label>
    );
  },
);

export default Label;
