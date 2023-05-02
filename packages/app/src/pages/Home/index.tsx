import { useState } from 'react';
import Account from '../../components/Account';
import MainContent from '../../components/MainContent';
import MobileNav from '../../components/MobileNavbar';
import RecentTransactions from '../../components/RecentTransactions';
import Sidebar from '../../components/Sidebar';
import AddTransaction from '../AddTransaction';
import BalanceWidget from '../../components/AccountBalanceWidget';
import AccountOverviewWidget from '../../components/AccountOverviewWidget';
import CardInfoWidget from '../../components/CardInfoWidget/cardInfoWidget';
import { useSelector } from 'react-redux';
import { accountSelected } from '../../store/User/index.selector';

export type TShowComponent = {
  show: boolean;
  componentName: string;
};

const Home = () => {
  const selectedAccount = useSelector(accountSelected);
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
        <div className="w-full h-full flex flex-wrap md:gap-14 lg:gap-24 py-3 px-1">
          <div className="flex-1 w-full md:max-w-xl flex flex-col md:justify-between">
            <Account />
            <RecentTransactions />
          </div>
          <div className="mt-10 md:mt-0 md:px-4 md:max-w-2xl flex-1 w-full flex flex-wrap flex-col justify-between">
            <div className="w-full relative flex md:overflow-y-auto 2xl:overflow-y-hidden flex-wrap 2xl:flex-nowrap gap-3 items-center justify-between rounded-md h-60">
              <BalanceWidget selectedAccount={selectedAccount} />
              <CardInfoWidget selectedAccount={selectedAccount} />
            </div>
            <AccountOverviewWidget />
          </div>
        </div>
      </MainContent>
    </>
  );
};

export default Home;
