import React from "react";
import Loader from "react-loader-spinner";
import styles from "../styles/loading.module.scss";

export default function Loading() {
  return (
    <div className={styles.loading}>
      <h2>Loading</h2>
      <Loader type="Oval" color="#006699" height={60} width={60} />
    </div>
  );
}
