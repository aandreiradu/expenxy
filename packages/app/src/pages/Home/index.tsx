import { useEffect, useState } from 'react';
import Account from '../../components/Account';
import MainContent from '../../components/MainContent';
import MobileNav from '../../components/MobileNavbar';
import RecentTransactions from '../../components/RecentTransactions';
import Sidebar from '../../components/Sidebar';
import { useHttpRequest } from '../../hooks/useHttp';
import { useAppSelector } from '../../store/hooks';
import { selectAccessToken } from '../../store/User/index.slice';
import AddTransaction from '../AddTransaction';

export type TShowComponent = {
  show: boolean;
  componentName: string;
};

const Home = () => {
  const { error, isLoading, sendRequest } = useHttpRequest();
  const [showComponent, setShowComponent] = useState<TShowComponent>({
    show: false,
    componentName: '',
  });

  useEffect(() => {
    console.log('showComponent', showComponent);
  }, [showComponent]);

  // useEffect(() => {
  //   const getBankAccountConfig = async () => {
  //     const bankingResponse = await sendRequest({
  //       url: '/getBankingProducts',
  //       method: 'GET',
  //       withCredentials: true,
  //     });

  //     console.log('bankingResponse', bankingResponse);
  //   };

  //   getBankAccountConfig();
  // }, []);

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
        <Account />
        <RecentTransactions />
      </MainContent>
    </>
  );
};

export default Home;
