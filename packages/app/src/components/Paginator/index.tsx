import React, { FC, PropsWithChildren, ReactNode } from 'react';
import PaginatorControlButton from './PaginatorControlButton';

export type PaginatorProps = {
  onPrevious: () => void;
  onNext: () => void;
  currentPage: number;
  lastPage: number;
  children: ReactNode;
};

const Paginator: FC<PaginatorProps> = ({ children, currentPage, lastPage, onNext, onPrevious }) => {
  return (
    <>
      {children}
      <div className="flex justify-center gap-2 mt-auto">
        {currentPage > 1 && <PaginatorControlButton text="Previous" onClick={onPrevious} />}
        {currentPage < lastPage && <PaginatorControlButton text="Next" onClick={onNext} />}
      </div>
    </>
  );
};

export default Paginator;
