import React, { FC, ReactNode } from 'react';

type ModalTransactionProps = {
  children?: JSX.Element;
};

const ModalTransaction: FC<ModalTransactionProps> = ({ children }) => {
  return (
    <>
      <div className="overlay fixed top-0 left-0 w-screen h-screen bg-black/40 flex items-center justify-center z-10">
        {children}
      </div>
    </>
  );
};

export default ModalTransaction;
