import { useState } from 'react';
import Account from '../../components/Account';
import MainContent from '../../components/MainContent';
import MobileNav from '../../components/MobileNavbar';
import RecentTransactions from '../../components/RecentTransactions';
import Sidebar from '../../components/Sidebar';
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
        <div className="w-full h-full flex justify-between gap-14 py-3">
          <div className="flex-1 w-full max-w-xl h-full flex flex-col justify-between">
            <Account />
            <RecentTransactions />
          </div>
          <div className="flex-1 w-full h-full flex flex-col justify-between bg-green-600">
            <p>balance</p>
            <p>expenses</p>
          </div>
        </div>
      </MainContent>
    </>
  );
};

export default Home;
