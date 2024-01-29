import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import validator from 'validator';

import styles from "../styles/Login.module.css";
import { magic } from "@/lib/magic-client";

const Login = () => {
    const [email, setEmail] = useState("");
    const [userMsg, setUserMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const handleCompleteRouteChange = () => {
            setIsLoading(false);
        };

        router.events.on('routeChangeComplete', handleCompleteRouteChange);
        router.events.on('routeChangeError', handleCompleteRouteChange);

        return () => {
            router.events.off('routeChangeComplete', handleCompleteRouteChange);
            router.events.off('routeChangeError', handleCompleteRouteChange);
        }
    }, [router]);

    const handleOnChangeEmail = (e) => {
        setUserMsg("");
        setEmail(e.target.value);
    }

    const handleSignInWithEmail = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (email) { // TODO: validate if email is actually an email.
            if (validator.isEmail(email)) {
                // log in a user by their email
                try {
                    const didToken = await magic.auth.loginWithMagicLink({
                        email,
                    });
                    if (didToken) {
                        // call login api
                        const response = await fetch("/api/login", {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${didToken}`,
                                "Content-type": "application/json",
                            }
                        });
                        const logginApiResponse = await response.json();
                        if (logginApiResponse.done) {
                            router.push("/");
                        } else {
                            setIsLoading(false);
                            setUserMsg("Something went wrong logging in.");
                        }
                    }
                } catch (error) {
                    setIsLoading(false);
                    console.error("Something went wrong logging in.", error);
                }

            } else {
                setIsLoading(false);
                setUserMsg("Please enter a valid email.");
            }
        } else {
            setIsLoading(false);
            setUserMsg("Please enter a valid email address.")
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Work & Listen Sign In</title>
            </Head>

            <header className={styles.header}>
                <div className={styles.headerWrapper}>
                    <Link href="/" className={styles.logoLink}>
                        <div className={styles.logoWrapper}>
                            <Image src="/static/woli-logo.png" width={150} height={80} alt="Work & Listen Logo"/>
                        </div>
                    </Link>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.mainWrapper}>
                    <h1 className={styles.signinHeader}>Sign In</h1>

                    <input className={styles.emailInput} type='text' placeholder='Email address' onChange={handleOnChangeEmail} />
                    <p className={styles.userMsg}>{userMsg}</p>

                    <button className={styles.loginBtn} onClick={handleSignInWithEmail}>{isLoading ? 'Loading...' : 'Sign In'}</button>
                </div>
            </main>

        </div>
    );
};

export default Login;