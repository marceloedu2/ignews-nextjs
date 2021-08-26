import ActiveLink from "../ActiveLink";
import SignInButton from "../SignInButton";
import styles from "./styles.module.scss";

const Header = () => {
  return (
    <header className={styles.headerContaiener}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ig.news" />
        <nav>
          <ActiveLink href="/" activeClass={styles.active}>
            <a>Home</a>
          </ActiveLink>
          <ActiveLink href="/posts" activeClass={styles.active}>
            <a>posts</a>
          </ActiveLink>
          {/* <ActiveLink href="/" activeClass={styles.active} >
            Home
          </ActiveLink>
          <ActiveLink href="/posts" activeClass={styles.active} prefetch>
            posts
          </ActiveLink> */}
        </nav>
        <SignInButton />
      </div>
    </header>
  );
};

export default Header;
