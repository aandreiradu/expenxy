import { Fragment, memo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, FC, SetStateAction, useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '../../components/Input';
import { TShowComponent } from '../Home';
import { AddTransactionProps, addTransactionSchema } from './schema';
import { useHttpRequest } from '../../hooks/useHttp';
import { Listbox, Transition } from '@headlessui/react';
import { Check, CaretCircleDown } from 'phosphor-react';
import { useSelector } from 'react-redux';
import { selectUserAccounts } from '../../store/Account/index.selector';

export type AvailableTypes = 'Expense' | 'Income';
export type AvailableCurrency = 'RON' | 'EUR';
type TAddTransaction = TShowComponent & {
  setShowComponent: Dispatch<SetStateAction<TShowComponent>>;
};

const typeProps: { value: AvailableTypes }[] = [{ value: 'Expense' }, { value: 'Income' }];

const AddTransaction: FC<TAddTransaction> = ({ show, componentName, setShowComponent }) => {
  const userAccounts = useSelector(selectUserAccounts);
  const [selected, setSelected] = useState<{ name: string; id: string }>({
    name: userAccounts[0].bankAccountType.name,
    id: userAccounts[0].id,
  });
  const [type, setType] = useState(typeProps[0].value);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddTransactionProps>({
    resolver: zodResolver(addTransactionSchema),
    mode: 'onSubmit',
  });
  const { error, isLoading, sendRequest } = useHttpRequest();

  const closeAddTransaction = useCallback(() => {
    setShowComponent({
      show: false,
      componentName: '',
    });
  }, []);

  const onSubmit: SubmitHandler<AddTransactionProps> = async (data) => {
    console.log('datatatata', data);
    console.log('errors', errors);
  };

  const handleAccountChange = (e: any) => {
    setSelected({
      name: e.name,
      id: e.id,
    });
    setValue('account', e.id);
  };

  const handleTransactionTypeChange = (e: any) => {
    setType(e.value);
    setValue('transactionType', e.value);
  };

  return (
    <>
      {show && componentName === 'AddTransaction' && (
        <>
          <div className="overlay fixed top-0 left-0 w-screen h-screen bg-black/40 flex items-center justify-center z-10">
            <div className="relative md:max-w-xl w-full h-full max-h-[450px] bg-[#1f1f1f]  text-yellow-400 gap-6 z-[11] rounded-xl ">
              <div className="w-full h-full flex flex-col pt-2 pb-5">
                {/* <div className="flex"> */}
                <span
                  className="bg-yellow-400 text-[#1f1f1f] p-1 px-3 rounded-full ml-auto mr-4 text-lg cursor-pointer"
                  onClick={closeAddTransaction}
                >
                  X
                </span>
                <h2 className="text-center flex-1 text-lg uppercase tracking-wide">New Transaction</h2>

                <form
                  className="gap-5 px-5 mt-4 w-full max-h-96 h-full grid grid-cols-2 justify-between"
                  // id="addTransaction"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  {/* Account */}
                  <Listbox value={selected} onChange={handleAccountChange}>
                    <div className="relative">
                      <Listbox.Label className="mb-3">Account</Listbox.Label>
                      <Listbox.Button className="text-white bg-transparent border border-white relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left shadow-md focus:outline-none sm:text-sm">
                        <span className="block truncate">{selected.name || `${userAccounts[0].name}`}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <CaretCircleDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </Listbox.Button>
                      {errors.account && <span className="text-red-500 text-sm">{errors.account?.message}</span>}
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {userAccounts.map((account) => (
                            <Listbox.Option
                              key={account.id}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-4 pr-4 ${
                                  active ? 'bg-yellow-400 text-amber-900' : 'text-gray-900'
                                }`
                              }
                              value={account}
                            >
                              {({ selected }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                    {account?.name} ({account?.currency.code}, {account?.bankAccountType?.name})
                                  </span>
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                      <Check className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>

                  {/* Type */}
                  <Listbox value={type} onChange={handleTransactionTypeChange}>
                    <div className="relative" id="type">
                      <Listbox.Label className="mb-3">Type</Listbox.Label>
                      <Listbox.Button className="text-white bg-transparent border border-white relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left shadow-md focus:outline-none sm:text-sm">
                        <span className="block truncate">{type}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <CaretCircleDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </Listbox.Button>
                      {errors.transactionType && (
                        <span className="text-red-500 text-sm">{errors.transactionType?.message}</span>
                      )}
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {typeProps.map((type, typeIdx) => (
                            <Listbox.Option
                              key={typeIdx}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active ? 'bg-yellow-400 text-amber-900' : 'text-gray-900'
                                }`
                              }
                              value={type}
                            >
                              {({ selected }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                    {type.value}
                                  </span>
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                      <Check className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                    {/* </div> */}
                  </Listbox>

                  {/* Amount */}
                  <div className="relative z-0">
                    <Input
                      {...register('amount', {
                        valueAsNumber: true,
                      })}
                      type="number"
                      error={errors.amount?.message}
                      className="appearance-none block py-2.5 px-0 w-full text-base text-white bg-transparent border-0 border-b-2 border-gray-300 dark:text-white dark:border-gray-600 dark:focus:border-[#7289DA] focus:outline-none focus:ring-0 focus:border-yellow-400 peer"
                      label="Amount"
                      required
                    />
                  </div>

                  {/* Merchant */}
                  <div className="relative z-0">
                    <Input
                      {...register('merchant')}
                      error={errors.merchant?.message}
                      className="appearance-none block py-2.5 px-0 w-full text-base text-white bg-transparent border-0 border-b-2 border-gray-300 dark:text-white dark:border-gray-600 dark:focus:border-yellow-400 focus:outline-none focus:ring-0 focus:border-yellow-400 peer"
                      label="Merchant"
                    />
                  </div>

                  {/* Date */}
                  <div className="relative z-0">
                    <Input
                      {...register('date')}
                      type="date"
                      error={errors.date?.message}
                      className="appearance-none block py-2.5 px-0 w-full text-base text-white bg-transparent border-0 border-b-2 border-gray-300 dark:text-white dark:border-gray-600 dark:focus:border-yellow-400 focus:outline-none focus:ring-0 focus:border-yellow-400 peer"
                      label="Date"
                      required
                    />
                  </div>

                  {/* Details */}
                  <div className="relative z-0">
                    <Input
                      {...register('details')}
                      type="text"
                      error={errors.details?.message}
                      className="appearance-none block py-2.5 px-0 w-full text-base text-white bg-transparent border-0 border-b-2 border-gray-300 dark:text-white dark:border-gray-600 dark:focus:border-yellow-400 focus:outline-none focus:ring-0 focus:border-yellow-400 peer"
                      label="Details"
                    />
                  </div>

                  <button
                    // form="addTransaction"
                    disabled={isSubmitting}
                    className="col-span-2 disabled:cursor-not-allowed disabled:pointer-events-none w-full text-[#1f1f1f] bg-yellow-400 p-3 rounded-md text-lg uppercase hover:bg-white focus:bg-white focus:outline-none transition-all duration-100 ease-in"
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default memo(AddTransaction);
