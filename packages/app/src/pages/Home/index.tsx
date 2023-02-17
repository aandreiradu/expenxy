import MainContent from '../../components/MainContent';
import RecentTransactions from '../../components/RecentTransactions';
import Sidebar from '../../components/Sidebar';
import { useAppSelector } from '../../store/hooks';
import { selectAccessToken } from '../../store/User/index.slice';

const Home = () => {
  return (
    <>
      <Sidebar />
      <MainContent>
        <RecentTransactions />
      </MainContent>
    </>
  );
};

export default Home;
