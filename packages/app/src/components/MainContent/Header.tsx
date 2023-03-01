interface HeaderProps {
  title: string;
  userFullname: string;
}

const Header = ({ title, userFullname }: HeaderProps) => {
  return (
    <>
      <span className="capitalize text-xs text-gray-400 italic">
        {title || 'welcome back'}
      </span>
      <p className=" text-xl text-black italic font-bold">
        {userFullname || ''}
      </p>
    </>
  );
};

export default Header;
