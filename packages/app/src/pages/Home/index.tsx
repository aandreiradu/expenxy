import { useState } from 'react';
import Account from '../../components/Account';
import MainContent from '../../components/MainContent';
import MobileNav from '../../components/MobileNavbar';
import RecentTransactions from '../../components/RecentTransactions';
import Sidebar from '../../components/Sidebar';
import AddTransaction from '../AddTransaction';
import BalanceWidget from '../../components/AccountBalanceWidget/balanceWidget';
import ExpensesWidget from '../../components/AccountExpensesWidget/expensesWidget';
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
      <MobileNav />
      <Sidebar setShowComponent={setShowComponent} />
      <MainContent>
        <AddTransaction
          show={showComponent.show}
          componentName={showComponent.componentName}
          setShowComponent={setShowComponent}
        />
        <div className="w-full h-full flex md:gap-14 lg:gap-24 py-3">
          <div className="flex-1 w-full max-w-xl h-full flex flex-col justify-between">
            <Account />
            <RecentTransactions />
          </div>
          <div className="flex-1 w-full max-w-xl h-full flex flex-col justify-between">
            <div className="relative flex flex-wrap justify-between rounded-md h-52 gap-5">
              <BalanceWidget selectedAccount={selectedAccount} />
              <CardInfoWidget selectedAccount={selectedAccount} />
            </div>
            <ExpensesWidget />
          </div>
        </div>
      </MainContent>
    </>
  );
};

export default Home;
