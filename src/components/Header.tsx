import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Router from "next/router";
import { signOut, useSession } from 'next-auth/react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { HamburgerIcon, AddIcon, EmailIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import Image from 'next/image';
import Style from '../styles/Header.module.scss';
import headerIcon from '../assets/homeIcon.svg';

const Header = (): JSX.Element => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) => router.pathname === pathname;

  const { data: session, status } = useSession();

  const links = [
    { href: '/', label: 'Home', icon: headerIcon, show: true },
    { href: '/drafts', label: 'My Drafts', show: !!session },
    { href: '/published', label: 'My Published', show: !!session },
    { href: '/inbox', label: 'My Inbox', show: !!session },
  ];

  const mobileMenuItems = [
    { href: '/create', label: 'New Post', icon: <AddIcon /> },
    { href: '/drafts', label: 'Drafts', icon: <EditIcon /> },
    { href: '/inbox', label: 'Inbox', icon: <EmailIcon /> },
    { href: '/published', label: 'Published', icon: <ViewIcon /> },
    { href: '/api/auth/signout', label: 'Logout', icon: <EditIcon />, onClick: () => signOut() },
  ];

  const left = (
    <div className={Style.left}>
      {links
        .filter(link => link.show)
        .map((link) => (
          <Link key={link.href} href={link.href} data-active={isActive(link.href)}>
            {link.icon ? (
              <Image className='headerIcon' src={link.icon} alt={''} height={30} width={30} />
            ) : (
              link.label
            )}
          </Link>
        ))}
    </div>
  );

  let right = null;

  if (status === 'loading') {
    right = (
      <div className={Style.right}>
        <p>Validating session ...</p>
      </div>
    );
  } else if (!session) {
    right = (
      <div className={Style.right}>
          < Link className={Style.loginLink} href="/api/auth/signin" data-active={isActive('/signup')}>
            Log in
          </Link>
      </div>
    );
  } else if (session) {
    right = (
      <div className={Style.right}>
        <p className={Style.accountNameHeader}>
          {session?.user?.email}
        </p>
        <span className={Style.mobileMenu}>
          <MobileMenu items={mobileMenuItems} />
        </span>
        <Link href="/create">
          <button>New post</button>
        </Link>
        <button onClick={() => signOut()}>
          <a>Log out</a>
        </button>
      </div>
    );
  }

  return (
    <nav className={Style.nav}>
      {left}
      {right}
    </nav>
  );
};

const MobileMenu = ({ items }: { items: any[]}): JSX.Element => {
  return (
    <Menu >
      <MenuButton
        as={IconButton}
        aria-label='Options'
        icon={<HamburgerIcon />}
        color='black'
      />
      <MenuList>
        {items.map((item) => (
          <MenuItem key={item.href} color={"black"} icon={item.icon} onClick={()=>{
            Router.push(item.href)
          }}>
              {item.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default Header;