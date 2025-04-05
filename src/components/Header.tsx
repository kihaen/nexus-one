import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Router from "next/router";
import { signOut, useSession } from "next-auth/react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Image from "next/image";
import Style from "../styles/Header.module.scss";
import headerIcon from "../assets/homeIcon.svg";

const Header = (): JSX.Element => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  const links = [{ href: "/", label: "Home", icon: headerIcon, show: true }];

  const mobileMenuItems = [
    { href: "/create", label: "New Post" },
    { href: "/drafts", label: "Drafts" },
    { href: "/inbox", label: "Inbox" },
    { href: "/published", label: "Published" },
    {
      label: "Logout",
      onClick: () => {
        signOut();
      },
    },
  ];

  const left = (
    <div className={Style.left}>
      {links
        .filter((link) => link.show)
        .map((link) => (
          <Link
            key={link.href}
            href={link.href}
            data-active={isActive(link.href)}
          >
            {link.icon ? (
              <Image
                className="headerIcon"
                src={link.icon}
                alt={""}
                height={30}
                width={30}
              />
            ) : (
              link.label
            )}
          </Link>
        ))}
    </div>
  );

  let right = null;

  if (status === "loading") {
    right = (
      <div className={Style.right}>
        <p>Validating session ...</p>
      </div>
    );
  } else if (!session) {
    right = (
      <div className={Style.right}>
        <Link
          className={Style.loginLink}
          href="/api/auth/signin"
          data-active={isActive("/signup")}
        >
          Log in
        </Link>
      </div>
    );
  } else if (session) {
    right = (
      <div className={Style.right}>
        <p className={Style.accountNameHeader}>{session?.user?.email}</p>
        <span className={Style.mobileMenu}>
          <MobileMenu items={mobileMenuItems} />
        </span>
        <Link href={`/profile/${session.user.id}`}>
          <div className={Style.profileLink}>
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || ""}
                width={32}
                height={32}
                className={Style.profileImage}
              />
            ) : (
              <span className={Style.profileInitial}>
                {session.user.name?.[0]?.toUpperCase() || "U"}
              </span>
            )}
          </div>
        </Link>
        <Link href="/api/auth/signout">
          <button>Log out</button>
        </Link>
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

const MobileMenu = ({ items }: { items: any[] }): JSX.Element => {
  return (
    <Menubar className="bg-black border-transparent">
      <MenubarMenu>
        <MenubarTrigger className="bg-transparent">{"Menu"}</MenubarTrigger>
        <MenubarContent>
          {items.map((item, index) => (
            <MenubarItem
              key={item?.href || `#${index}`}
              onClick={
                item.onClick
                  ? item.onClick
                  : () => {
                      Router.push(item.href);
                    }
              }
            >
              {item.label}
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default Header;
