import { FC, ReactNode } from 'react';
import { ComponentPropsWithoutRef } from 'react';

type BackButtonProps = {
  classNames: string;
  disabled?: boolean;
  id: string;
  value: string | ReactNode;
  loading?: boolean;
  onClick: () => void;
};

const BackButton: FC<BackButtonProps> = ({ classNames, id, disabled, value, ...props }) => {
  return (
    <button id={id} className={classNames} disabled={disabled} {...props}>
      {value}
    </button>
  );
};

export default BackButton;
