import React from "react";
import GitHubButton from "react-github-btn";
import styles from "../styles/instructions.module.scss";
import Button from "./button";

interface Props {
  start: () => void;
}

export default function Instructions(props: Props) {
  const { start } = props;
  
  return (
    <div className={styles.instructions}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Famozily</h1>
        <h2>Place the cards on the timeline in the correct order.</h2>
        <Button onClick={start} text="Start game" />
        <div className={styles.about}>
                   <div>
  Made with ♥ by{" "}
  <a
    href="https://flicstar.com"
    target="_blank"
    rel="noopener noreferrer"
  >
    flicstar
  </a></div>
          <div>
            Data sourced from family history and{" "}
            <a
              href="https://www.wikipedia.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikipedia
            </a>   
          </div>
{" "}
  <div>Based on Tom Watson&#39;s game{" "}
  <a
    href="https://github.com/tom-james-watson/wikitrivia/"
    target="_blank"
    rel="noopener noreferrer"
  >
    Wikitrivia
  </a>
</div>
          <GitHubButton
            href="https://github.com/tom-james-watson/wikitrivia"
            data-size="large"
          ></GitHubButton>
        </div>
      </div>
    </div>
  );
}