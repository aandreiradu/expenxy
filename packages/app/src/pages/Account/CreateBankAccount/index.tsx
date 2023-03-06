import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '../../../components/Input';
import { Select } from '../../../components/Select';
import { createBankAccountSchema, type CreateBankAcountProps } from './schema';
import { PulseLoader } from 'react-spinners';
import { Warning } from 'phosphor-react';
import { Link } from 'react-router-dom';
import { useHttpRequest } from '../../../hooks/useHttp';
import statsAndMaps from '../../../config/statusAndMessagesMap';
import MyDialog from '../../../components/UI/TopLevelNotification';

export interface CreateBankAccountProps {
  title: string;
  className?: string;
}

const currencyTypes = [{ value: 'EUR' }, { value: 'RON' }];
const bankAccountTypes = [
  { value: 'Bank Account' },
  { value: 'Savings' },
  { value: 'Morgage' },
];

const CreateBankAccount: FC<CreateBankAccountProps> = ({ title }) => {
  const [topLevelNotification, setTopLevelNotification] = useState({
    show: false,
    message: '',
  });
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<CreateBankAcountProps>({
    resolver: zodResolver(createBankAccountSchema),
    mode: 'onSubmit',
  });
  const { error, isLoading, sendRequest } = useHttpRequest();

  const onSubmit: SubmitHandler<CreateBankAcountProps> = async (data) => {
    console.log('data', data);

    const createBankAccResponse = await sendRequest({
      method: 'POST',
      url: '/createBankAccount',
      withCredentials: true,
      body: {
        accountName: data.accountName,
        currency: data.currency,
        balance: data.balance,
        accountType: data.accountType,
      },
    });

    if (createBankAccResponse && createBankAccResponse?.data) {
      console.log('createResponse', createBankAccResponse);
      const { balance, currency, type } = createBankAccResponse.data;
      const { message, status } = createBankAccResponse;

      if (
        status === statsAndMaps['existingBankAccountFound']?.status &&
        message === statsAndMaps['existingBankAccountFound'].message
      ) {
        const { frontendMessage } = statsAndMaps['existingBankAccountFound'];
        if (frontendMessage) {
          setTopLevelNotification({
            show: true,
            message: frontendMessage,
          });
        }
      }
    }
  };

  useEffect(() => {
    console.log('topLevelNotification STATE', topLevelNotification);
  }, [topLevelNotification]);

  return (
    <>
      {topLevelNotification.show && (
        <MyDialog
          hasCloseButton={false}
          dismissAfterXMs={5500}
          message={topLevelNotification.message}
          show={topLevelNotification.show}
          onClose={() => setTopLevelNotification({ show: false, message: '' })}
          icon={<Warning className="w-14 h-8 text-yellow-400" />}
        />
      )}

      <section className="relative w-screen h-screen flex flex-col items-center justify-center px-4 ">
        <img
          className="absolute top-0 left-0 w-full h-full brightness-[40%]"
          src="./landing-background.jpg"
        />
        <h1 className="top-0 text-center sm:text-2xl md:text-3xl tracking-[10px] md:mb-5 text-white sm:py-2  py-5">
          EXPENXY
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="create-bank-account"
          className="relative max-w-sm md:max-w-md w-full flex flex-col space-y-10 rounded-xl px-5 py-3 border-yellow-400 border text-white"
        >
          <h1
            className="
                relative  p-3
                text-md capitalize 
                text-white text-center
                after:absolute after:bottom-0 after:left-1/2 after:w-2/4 after:h-[2px] after:bg-yellow-400 
                after:-translate-x-2/4
            "
          >
            {title ?? 'Create Your Bank Account'}
          </h1>
          <div className="relative z-0">
            <Input
              {...register('accountName')}
              error={errors.accountName?.message}
              type="text"
              className="block w-full mt-2 py-2 text-base text-white bg-transparent 
            border-0 border-b-2 border-yellow-400
            appearance-none 
            dark:text-white 
            dark:border-yellow-500 
            dark:focus:border-[#fff] 
            focus:outline-none focus:ring-0 focus:border-[#fff]"
              required
              id="accountName"
              label="Account Name"
            />
          </div>
          <div className="relative z-0">
            <Select
              {...register('accountType')}
              error={errors.accountType?.message}
              className=" block w-full mt-2 py-2 text-base text-white bg-transparent 
                        border-0 border-b-2 border-yellow-400 
                        appearance-none dark:text-white 
                        dark:border-yellow-400 
                        dark:focus:border-[#fff] 
            focus:outline-none focus:ring-0 focus:border-[#fff]"
              required
              dataSourceGroup={bankAccountTypes}
              id="type"
              label="Account Type"
            />
          </div>
          <div className="relative z-0">
            <Select
              {...register('currency')}
              error={errors.currency?.message}
              className=" block w-full mt-2 py-2 text-base text-white bg-transparent 
            border-0 border-b-2 border-yellow-400 
            appearance-none dark:text-white 
            dark:border-yellow-400 
            dark:focus:border-[#fff] 
            focus:outline-none focus:ring-0 focus:border-[#fff]"
              required
              dataSourceGroup={currencyTypes}
              id="type"
              label="Currency"
            />
          </div>
          <div className="relative z-0">
            <Input
              {
                ...register('balance')
                // ,{
                //   onChange: (e) => {
                //     console.log('e is', e.target.value);
                //     console.log(
                //       'result is',
                //       getFormattedCurrency(Number(e.target.value)),
                //     );
                //     setValue(
                //       'balance',
                //       getFormattedCurrency(Number(e.target.value)),
                //     );
                //     console.log('getValues', getValues('balance'));
                //   },
                // }
              }
              error={errors.balance?.message}
              type="number"
              className="block w-full mt-2 py-2 text-base text-white bg-transparent 
            border-0 border-b-2 border-yellow-400 
            appearance-none 
            dark:text-white 
            dark:border-yellow-400 
            dark:focus:border-[#fff] 
            focus:outline-none focus:ring-0 focus:border-[#fff]"
              id="type"
              label="Balance"
              defaultValue="0"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <Link
              to={'/login'}
              className=" !mb-4
            p-[6px] text-base
            md:p-2 md:text-lg          
            disabled:cursor-not-allowed disabled:pointer-events-none 
            w-full bg-yellow-400 text-white rounded-md 
             uppercase 
            hover:bg-[#1f1f1f] hover:text-white 
            focus:bg-[#1f1f1f] focus:text-white 
            focus:outline-none transition-all duration-100 ease-in
            text-center
            "
            >
              Back To Login
            </Link>
            <button
              type="submit"
              // disabled={Object.keys(errors).length > 0}
              form="create-bank-account"
              className=" !mb-4
                        p-[6px] text-base
                        md:p-2 md:text-lg          
                        disabled:cursor-not-allowed disabled:pointer-events-none 
                        w-full bg-yellow-400 text-white rounded-md 
                         uppercase 
                        hover:bg-[#1f1f1f] hover:text-white 
                        focus:bg-[#1f1f1f] focus:text-white 
                        focus:outline-none transition-all duration-100 ease-in
                        text-center
                        "
            >
              Create
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default CreateBankAccount;
