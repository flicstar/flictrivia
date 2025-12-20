import React from "react";
import classNames from "classnames";
import { Droppable } from "react-beautiful-dnd";
import { Item } from "../types/item";
import ItemCard from "./item-card";
import styles from "../styles/next-item-list.module.scss";

interface NextItemListProps {
  next: Item | null;
}

export default function NextItemList(props: NextItemListProps) {
  const { next } = props;

  const [arming, setArming] = React.useState(false);

  return (
    <div className={styles.container}>
      <Droppable droppableId="next" direction="horizontal">
        {(provided) => (
          <div
            className={classNames(styles.wrapper, {
              [styles.arming]: arming,
            })}
          >
            {arming && (
              <svg
                className={styles.armingTrace}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <rect
                  className={styles.tracePath}
                  x="2"
                  y="2"
                  width="96"
                  height="96"
                  rx="5"
                  ry="5"
                  pathLength={1}
                />
              </svg>
            )}

            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={styles.list}
            >
              {next && (
                <ItemCard
                  draggable
                  index={0}
                  item={next}
                  key={next.id}
                  onArmStart={() => setArming(true)}
                  onArmEnd={() => setArming(false)}
                />
              )}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
}
