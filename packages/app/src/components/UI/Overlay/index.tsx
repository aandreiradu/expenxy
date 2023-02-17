import React, { ReactNode } from 'react';

interface OverlayArgs {
  children?: ReactNode;
  zIndex?: string;
}

const Overlay = ({ children, zIndex }: OverlayArgs) => {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-screen z-[${
        zIndex ? zIndex : '2'
      }] bg-black/[.6]`}
    >
      {children}
    </div>
  );
};

export default Overlay;
