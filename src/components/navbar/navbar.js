import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import styles from "./navbar.module.css";

import { magic } from "@/lib/magic-client";

const NavBar = (props) => {
  const [showDropDown, setShowDropDown] = useState();
  const [username, setUsername] = useState("");

  const router = useRouter();

  useEffect(() => {
    const getUsername = async () => {
      // Assumes a user is already logged in
      try {
        const { email } = await magic.user.getMetadata();
        setUsername(email);
      } catch (error) {
        console.error("Something went wrong.", error);
      }
    };

    getUsername();
  }, []);

  const handleOnClickHome = (e) => {
    e.preventDefault();
    router.push("/");
  }

  const handleOnClickMyList = (e) => {
    e.preventDefault();
    router.push("/browse/my-list");
  }

  const handleShowDropDown = (e) => {
    e.preventDefault();
    setShowDropDown(!showDropDown);
  }

  const handleSignOut = async (e) => {
    e.preventDefault();

    try {
      const didToken = await magic.user.getIdToken();
      if (didToken) {
        // call logout api
        const response = await fetch("/api/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${didToken}`,
            "Content-type": "application/json",
          }
        });
        await response.json();
      }
    } catch (error) {
      console.error("Error logging out.", error);
      router.push("/login");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <a className={styles.logoLink}>
          <div className={styles.logoWrapper}>
            <Image src="/static/woli-logo.png" width={150} height={80} alt="Work & Listen Logo" />
          </div>
        </a>
        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleOnClickHome} >Home</li>
          <li className={styles.navItem2} onClick={handleOnClickMyList} >My List</li>
        </ul>
        <nav className={styles.navContainer}>
          <div>
            <button className={styles.usernameBtn} onClick={handleShowDropDown}>
              <p className={styles.username}>{username}</p>
              <Image src="/static/expand_more.svg" width={24} height={24} alt="Expand more icon" />
            </button>
            {
              showDropDown && (
                <div className={styles.navDropdown}>
                  <div>
                    <a className={styles.linkName} onClick={handleSignOut}>
                      Sign out
                    </a>
                    <div className={styles.lineWrapper}></div>
                  </div>
                </div>
              )
            }

          </div>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;