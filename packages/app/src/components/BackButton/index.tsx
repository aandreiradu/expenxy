import { FC } from 'react';
import { ComponentPropsWithoutRef } from 'react';

type BackButtonProps = ComponentPropsWithoutRef<'button'> & {
  classNames: string;
  disabled?: boolean;
  id: string;
  value: string;
  loading?: boolean;
};

const BackButton: FC<BackButtonProps> = ({ classNames, id, disabled, value, ...props }) => {
  return (
    <button id={id} className={classNames} disabled={disabled} {...props}>
      {value}
    </button>
  );
};

export default BackButton;
