import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import RecentTransactions from './components/RecentTransactions';

function App() {
  return (
    <main className="flex">
      <Sidebar />
      <MainContent>
        <RecentTransactions />
      </MainContent>
    </main>
  );
}

export default App;
