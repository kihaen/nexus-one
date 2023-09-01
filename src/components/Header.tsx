import React, { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import Style from '../styles/Header.module.scss'

const Header = () : JSX.Element => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;
    
  const { data: session, status } = useSession();

  let left = (
    <div className={Style.left}>
      <Link href="/">
        <a className="bold" data-active={isActive('/')}>
          Feed
        </a>
      </Link>
    </div>
  );

  let right = null;

  if (status === 'loading') {
    left = (
      <div className={Style.left}>
        <Link href="/">
          <a className="bold" data-active={isActive('/')}>
            Feed
          </a>
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
        <Link href="/api/auth/signin">
          <a data-active={isActive('/signup')}>Log in</a>
        </Link>
      </div>
    );
  }

  if (session) {
    left = (
      <div className={Style.left}>
        <Link href="/">
          <a className="bold" data-active={isActive('/')}>
            Feed
          </a>
        </Link>
        <Link href="/drafts">
          <a data-active={isActive('/drafts')}>My Drafts</a>
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
            <a>New post</a>
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
          padding: 2rem;
          align-items: center;
          border-bottom : 1px black solid;
          background-color : black;
          color : white;
        }
      `}</style>
    </nav>
  );
};

export default Header;