import React from "react";
import classNames from "classnames";
import styles from "../styles/button.module.scss";

interface Props {
  minimal?: boolean;
  onClick: () => void;
  text: string;
  children?: React.ReactNode;
}

export default function Button(props: Props) {
  const { minimal = false, onClick, text, children } = props;

  return (
    <button
      onClick={onClick}
      className={classNames(styles.button, { [styles.minimal]: minimal })}
    >
      {children || text}
    </button>
  );
}