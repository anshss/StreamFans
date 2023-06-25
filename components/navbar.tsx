"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
// import Login from "./Login";
// import Logo from "../assets/images/logo.png"
import { usePathname } from "next/navigation";
import { LoginButton, WhenLoggedInWithProfile } from "./auth";

export default function Navbar() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const routerPathName = usePathname();

  const isActive = (pathname: String) => {
    return routerPathName === pathname;
  };

  //   const controlNavbar = () => {
  //     if (typeof window !== 'undefined') {
  //       if (window.scrollY > lastScrollY && window.scrollY > 100) {
  //         setShow(false);
  //       } else {
  //         setShow(true);
  //       }
  //       setLastScrollY(window.scrollY);
  //     }
  //   };

  //   useEffect(() => {
  //     if (typeof window !== 'undefined') {
  //       window.addEventListener('scroll', controlNavbar);

  //       return () => {
  //         window.removeEventListener('scroll', controlNavbar);
  //       };
  //     }
  //   }, [lastScrollY]);

  return (
    <header
      className={`${
        !show ? "-top-32" : "top-0"
      } transition-all ease-in-out duration-500 container mx-auto fixed left-0 right-0 z-40 w-full pt-0`}
    >
      <div className="px-5 ">
        <div className="relative flex">
          {/**/}
          <div
            className={`${
              show && lastScrollY > 100 ? "backdrop-blur" : ""
            } flex w-full items-center justify-between rounded-3xl py-4 px-8 lg:p-10`}
          >
            <div className="opacity-0 absolute inset-0 -z-10 rounded-3xl bg-gel-black/50 transition-opacity duration-500" />
            {/* <Link className="router-link-active w-20 router-link-exact-active mt-[-2px] flex transition-all duration-300 hover:opacity-60" href="/"> 
              <Image src={Logo}/>
            </Link> */}
            <nav className="relative z-10 transition-colors duration-300 w-full">
              <ul className="hidden flex-row items-center text-[15px] font-medium lg:flex [&>button]:px-10 justify-between w-full">
                <li className={isActive("/") ? "text-blue-500" : ""}>
                  <div className="relative inline-block w-full text-left">
                    <Link className="hover:opacity-75 lg:pl-5 lg:pr-5" href="/">
                      Home
                    </Link>
                  </div>
                </li>
                {/* <li className={isActive('/store') ? "text-blue-500" : ''}> 
                  <div className="relative inline-block w-full text-left">
                    <Link
                      className="hover:opacity-75 lg:pl-5 lg:pr-5"
                      href="/store"
                    >
                      Store
                    </Link>
                  </div>
                <li className={isActive('/meetings') ? "text-blue-500" : ''}>
                  <div className="relative inline-block w-full text-left">
                    <Link
                      className="hover:opacity-75 lg:pl-5 lg:pr-5"
                      href="/meetings"
                    >
                      Meetings
                    </Link>
                  </div>
                </li> */}
                <div className="flex flex-row items-center">
                  <li
                    className={isActive("/communities") ? "text-blue-500" : ""}
                  >
                    <div className="relative inline-block w-full text-left">
                      <Link
                        className="hover:opacity-75 lg:pl-5 lg:pr-5"
                        href="/manage"
                      >
                        Manage
                      </Link>
                    </div>
                  </li>
                  <WhenLoggedInWithProfile>
                    {({ profile }) => (
                      <li>
                        <div className="relative inline-block w-full text-left">
                          <div className="hover:opacity-75 lg:pl-5 lg:pr-5">{`@${profile.handle}`}</div>
                        </div>
                      </li>
                    )}
                  </WhenLoggedInWithProfile>

                  <li>
                    <div className="relative inline-block w-full text-left">
                        <div className="hover:opacity-75 lg:pl-5 lg:pr-5">

                      <LoginButton />
                        </div>
                    </div>
                  </li>
                </div>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
