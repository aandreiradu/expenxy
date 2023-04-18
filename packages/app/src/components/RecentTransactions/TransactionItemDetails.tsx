import { Trash, Pen } from 'phosphor-react';

const TransactionItemDetails = () => {
  return (
    <div
      className={`my-2 bg-white flex gap-3 items-center justify-end ml-auto rounded-md cursor-pointer p-2 animate-openScale`}
    >
      <div className="relative inline-block group">
        <Pen className="w-6 h-5 relative " />
        <span className="z-10 absolute hidden text-sm bg-[#1f1f1f] rounded-md px-1 bottom-full text-white group-hover:block">
          Edit
        </span>
      </div>
      <div className="relative inline-block group">
        <Trash className="w-6 h-5" />
        <span
          className="z-10 absolute hidden text-sm bg-[#1f1f1f] rounded-md bottom-full px-1 text-white 
            group-hover:block"
        >
          Delete
        </span>
      </div>
    </div>
  );
};

export default TransactionItemDetails;
