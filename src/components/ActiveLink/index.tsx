import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { cloneElement } from "react";
import { ReactElement } from "react";

interface IActiveLink extends LinkProps {
  children: ReactElement;
  activeClass: string;
}

const ActiveLink = ({ children, activeClass, ...props }: IActiveLink) => {
  const { asPath } = useRouter();

  const className = asPath === props.href ? activeClass : "";
  return <Link {...props}>{cloneElement(children, { className })}</Link>;
};

export default ActiveLink;
