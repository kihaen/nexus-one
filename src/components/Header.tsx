import React, { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Style from '../styles/Header.module.scss';
import headerIcon from '../assets/homeIcon.svg'

const Header = () : JSX.Element => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;
    
  const { data: session, status } = useSession();

  let left = (
    <div className={Style.left}>
      <Link href="/">Nexus</Link>
    </div>
  );

  let right = null;

  if (status === 'loading') {
    left = (
      <div className={Style.left}>
        <Link href="/" data-active={isActive('/')}>
            <Image className='headerIcon' src= {headerIcon} alt={''} height={30} width={30}/>
        </Link>
      </div>
    );
    right = (
      <div className={Style.right}>
        <p>Validating session ...</p>
        <style jsx>{`
          .right {
            margin-left: auto;
          }
        `}</style>
      </div>
    );
  }

  if (!session) {
    right = (
      <div className={Style.right}>
        <Link href="/api/auth/signin" data-active={isActive('/signup')}>
          Log in
        </Link>
      </div>
    );
  }

  if (session) {
    left = (
      <div className={Style.left}>
        <Link href="/" data-active={isActive('/')}>
            <Image className='headerIcon' src= {headerIcon} alt={''} height={30} width={30}/>
        </Link>
        <Link href="/drafts" data-active={isActive('/drafts')}>
          My Drafts
        </Link>
        <Link href="/published" data-active={isActive('/published')}>
          My Published
        </Link>
        <Link href="/inbox" data-active={isActive('/inbox')}>
          My Inbox
        </Link>
      </div>
    );
    right = (
      <div className={Style.right}>
        <p>
          {session?.user?.name} ({session?.user?.email})
        </p>
        <Link href="/create">
          <button>
          New post
          </button>
        </Link>
        <button onClick={() => signOut()}>
          <a>Log out</a>
        </button>
      </div>
    );
  }

  return (
    <nav>
      {left}
      {right}
      <style jsx>{`
        nav {
          display: flex;
          padding: 1rem;
          align-items: center;
          border-bottom : 1px black solid;
          background-color : black;
          color : white;
          transition: width 2s;
          transition-delay: 1s;
          a:hover{
            color : #509ef2;
          }
        }
      `}</style>
    </nav>
  );
};

export default Header;