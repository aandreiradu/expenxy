import React, { FC, ReactNode } from 'react';

interface ILoader {
  icon: ReactNode;
  loadingText?: string;
  textClasses?: string;
}

const Loader: FC<ILoader> = ({ icon, loadingText, textClasses }) => {
  return (
    <div className="relative w-full flex flex-col items-center justify-center z-10">
      <p className={textClasses}>{loadingText}</p>
      {icon}
    </div>
  );
};

export default Loader;
