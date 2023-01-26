import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import MainContentHeader from './components/MainContent/Header';
import RecentTransactions from './components/RecentTransactions';
import RecentTransctionsItem from './components/RecentTransactions/RecentTransactionsItems';
import ReactSVG from '/vite.svg';
import { AirplaneTilt } from 'phosphor-react';

function App() {
  return (
    <main className="flex">
      <Sidebar />
      <MainContent>
        <MainContentHeader
          title={'welcome back'}
          userFullname={'Andrei Radu'}
        />
        <RecentTransactions>
          {[...Array(4).keys()].map((transaction) => (
            <RecentTransctionsItem
              amount={25}
              currency={'$'}
              date={'2023-01-26'}
              merchant={'eMAG'}
              merchantLogoUrl={<AirplaneTilt className="h-16 w-16 p-4" />}
            />
          ))}
        </RecentTransactions>
      </MainContent>
    </main>
  );
}

export default App;
