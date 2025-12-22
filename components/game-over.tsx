import React from "react";
import { animated, useSpring } from "react-spring";
import styles from "../styles/game-over.module.scss";
import Button from "./button";

interface Props {
  resetGame: () => void;
  score: number;
}

const defaultShareText = "Share";



export default function GameOver(props: Props) {
  const { resetGame, score } = props;

  const animProps = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 500 },
  });

  const [shareText, setShareText] = React.useState(defaultShareText);

  const share = React.useCallback(async () => {
    await navigator.clipboard.writeText(
      `famozily.pages.dev\n\nScore: ${score} 🏆`
    );

    setShareText("Copied");
    setTimeout(() => {
      setShareText(defaultShareText);
    }, 2000);
  }, [ score]);

   return (
    <animated.div style={animProps} className={styles.gameOver}>
      <div className={styles.scoresWrapper}>
        <div className={styles.scoreCard}>
          <div className={styles.scoreLabel}>Your score</div>
          <div className={styles.scoreValue}>
            {score}
            <span className={styles.trophy}>🏆</span>
          </div>
        </div>
      </div>

      <div className={styles.buttons}>
        <Button onClick={resetGame} text="Play again" />
        <Button onClick={share} minimal>
          <span>{shareText}</span>
          <img src="/images/share.svg" alt="share" className={styles.shareIcon} />
        </Button>
      </div>
      <div className={styles.about}>
      <div>
        Want less fam? Play{" "}
        <a
          href="https://ozonly.pages.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          OzOnly
        </a>
      </div>
    </div>
    </animated.div>
  );
}