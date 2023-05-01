import { FC } from 'react';

export type PaginatorControlButtonProps = {
  text: string;
  onClick: () => void;
};

const PaginatorControlButton: FC<PaginatorControlButtonProps> = ({ onClick, text }) => {
  return (
    <button
      className="my-2 p-1 border border-white rounded-md bg-transparent cursor-pointer text-base
          hover:text-white hover:bg-yellow-400 hover:border-transparent hover:ease-in hover:outline-none
          focus:text-white focus:bg-yellow-400 focus:border-transparent focus:ease-in focus:outline-none
        "
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default PaginatorControlButton;
