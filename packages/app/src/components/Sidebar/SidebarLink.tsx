import { Dispatch, FC, ReactNode, SetStateAction, useCallback } from 'react';
import { TShowComponent } from '../../pages/Home';

export interface SidebarLinkProps {
  href: string;
  icon: ReactNode;
  setShowComponent?: Dispatch<SetStateAction<TShowComponent>>;
  name: string;
  className?: string;
}

const SidebarLink: FC<SidebarLinkProps> = ({
  href,
  icon,
  setShowComponent,
  name,
  className,
}) => {
  const clickHandler = () => {
    if (setShowComponent) {
      setShowComponent({
        show: true,
        componentName: name,
      });
    }
  };

  return (
    <button
      onClick={clickHandler}
      className={`p-3 group hover:bg-black rounded-md hover:shadow-md ${
        className ?? ''
      }`}
    >
      {icon}
    </button>
  );
};

export default SidebarLink;
