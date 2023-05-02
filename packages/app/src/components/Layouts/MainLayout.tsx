import { FC, PropsWithChildren, useState } from 'react';
import MainContent from '../../components/MainContent';
import MobileNav from '../../components/MobileNavbar';
import Sidebar from '../../components/Sidebar';
import AddTransaction from '../../pages/AddTransaction';

export type TShowComponent = {
  show: boolean;
  componentName: string;
};

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  const [showComponent, setShowComponent] = useState<TShowComponent>({
    show: false,
    componentName: '',
  });

  return (
    <>
      <MobileNav setShowComponent={setShowComponent} />
      <Sidebar setShowComponent={setShowComponent} />
      <MainContent>
        <AddTransaction
          show={showComponent.show}
          componentName={showComponent.componentName}
          setShowComponent={setShowComponent}
        />
        {children}
      </MainContent>
    </>
  );
};

export default MainLayout;
