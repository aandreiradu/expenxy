import { useEffect, useState } from 'react';
import MainContent from '../../components/MainContent';
import MobileNav from '../../components/MobileNavbar';
import RecentTransactions from '../../components/RecentTransactions';
import Sidebar from '../../components/Sidebar';
import { useAppSelector } from '../../store/hooks';
import { selectAccessToken } from '../../store/User/index.slice';
import AddTransaction from '../AddTransaction';

export type TShowComponent = {
  show: boolean;
  componentName: string;
};

const Home = () => {
  const [showComponent, setShowComponent] = useState<TShowComponent>({
    show: false,
    componentName: '',
  });

  useEffect(() => {
    console.log('showComponent', showComponent);
  }, [showComponent]);

  return (
    <>
      <MobileNav />
      <Sidebar setShowComponent={setShowComponent} />
      <MainContent>
        <AddTransaction
          show={showComponent.show}
          componentName={showComponent.componentName}
          setShowComponent={setShowComponent}
        />
        <RecentTransactions />
      </MainContent>
    </>
  );
};

export default Home;
