import React, { ReactNode } from 'react';

interface ResetLayoutProps {
  children?: ReactNode;
  description: string;
  headerTitle: string;
  headerIcon: ReactNode;
}

const ResetPasswordLayout = ({
  children,
  description,
  headerIcon,
  headerTitle,
}: ResetLayoutProps) => {
  return (
    <section className="h-screen w-screen bg-white  text-black flex items-center justify-center">
      <div className="max-w-xs flex flex-col items-center justify-center p-3">
        <div className=" flex justify-center p-1 rounded-full bg-yellow-300">
          {headerIcon}
        </div>
        <h3 className="text-xl font-bold mt-3 text-center">{headerTitle}</h3>
        <span className="mt-2 text-sm text-center">{description}</span>
        {children}
      </div>
    </section>
  );
};

export default ResetPasswordLayout;
