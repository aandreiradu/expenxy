import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import NotFound from './pages/NotFound/NotFound';
import Persist from './components/Persist';
import ResetPassword from './pages/ResetPassword';
import ResetPasswordEmailSent from './pages/ResetPassword/EmailSent';
import SetNewPassword from './pages/ResetPassword/SetNewPassword';
import CreateBankAccount from './pages/Account/CreateBankAccount';
import DeletedTransactions from './pages/DeletedTransactions';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/reset/sent" element={<ResetPasswordEmailSent />} />
        <Route path="/reset/:token" element={<SetNewPassword />} />
        <Route element={<Persist />}>
          <Route path="/" element={<Home />} />
          <Route path="/create-bank-account" element={<CreateBankAccount title="Create bank account" />} />
          <Route path="/deleted-transactions" element={<DeletedTransactions />} />
        </Route>
        <Route path="*" element={<NotFound />} />;
      </Routes>
    </>
  );
}

export default App;
