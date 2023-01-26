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
      <p className="capitalize text-xl text-black italic font-bold">
        {userFullname || 'Mr. Anderson'}
      </p>
    </>
  );
};

export default Header;
