import { ReactNode } from 'react';

export interface SidebarLinkProps {
  href: string;
  icon: ReactNode;
}

const SidebarLink = ({ href, icon }: SidebarLinkProps) => {
  return (
    <a
      href={href}
      className="p-3 group hover:bg-black rounded-md hover:shadow-md"
    >
      {icon}
    </a>
  );
};

export default SidebarLink;
