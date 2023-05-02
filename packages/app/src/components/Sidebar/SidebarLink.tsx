import { Dispatch, FC, ReactNode, SetStateAction, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TShowComponent } from '../../pages/Home';

export interface SidebarLinkProps {
  href: string;
  icon: ReactNode;
  setShowComponent?: Dispatch<SetStateAction<TShowComponent>>;
  name: string;
  className?: string;
  isLink?: boolean;
  children?: ReactNode;
}

const SidebarLink: FC<SidebarLinkProps> = ({ children, href, icon, setShowComponent, name, className, isLink = false }) => {
  const navigate = useNavigate();

  const clickHandler = () => {
    if (isLink) {
      console.log({ isLink, name });
    }

    if (!isLink) {
      console.log('nu este link');
      if (setShowComponent) {
        return setShowComponent({
          show: true,
          componentName: name,
        });
      }
    }

    console.log('este link,navigate to', href);
    navigate(`${href}`);
  };

  return (
    <button onClick={clickHandler} className={`p-3 group hover:bg-black rounded-md hover:shadow-md ${className ?? ''}`}>
      {icon}
      {children}
    </button>
  );
};

export default SidebarLink;
