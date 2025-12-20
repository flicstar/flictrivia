import React from "react";
import classNames from "classnames";
import { useSpring, animated } from "react-spring";
import { Draggable } from "react-beautiful-dnd";
import { Item, PlayedItem } from "../types/item";
import { createWikimediaImage } from "../lib/image";
import styles from "../styles/item-card.module.scss";

type Props = {
  draggable?: boolean;
  flippedId?: null | string;
  index: number;
  item: Item | PlayedItem;
  setFlippedId?: (flippedId: string | null) => void;
onArmStart?: () => void;
  onArmEnd?: () => void;
};

const datePropIdMap: { [datePropId: string]: string } = {
  P39: "elected",
  P569: "born",
  P570: "died",
  P571: "created",
  P575: "discovered", 
  P576: "ended",
  P577: "published",
  P580: "started",
  P582: "ended",
  P585: "occurred",
  P586: "introduced",
  P588: "released",
  P589: "formed",
  P1191: "first performed",
  P1249: "earliest record",
  P1619: "officially opened",
  P8556: "became extinct",
  P6949: "announced",
  P1319: "earliest",
  P1682: "graduated",
  P2842: "married",
  P3150: "travelled",
  P7124: "first one",
  P7125: "latest one",
  P7589: "date of assent",
  F250: "graduated",
};

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function ItemCard(props: Props) {
  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const { draggable, flippedId, index, item, setFlippedId } = props;

  const flipped = item.id === flippedId;
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
  if (!draggable || ("played" in item)) return;
  if (e.pointerType === "touch" || e.pointerType === "pen") {
    e.currentTarget.setPointerCapture?.(e.pointerId);
     props.onArmStart?.();
  }
};
   
const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
  e.currentTarget.releasePointerCapture?.(e.pointerId);
  if (e.pointerType === "touch" || e.pointerType === "pen") {
    props.onArmEnd?.();
  }
};

   React.useEffect(() => {
  if (!draggable) return;

  const el = cardRef.current;
  if (!el) return;

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
  };

  el.addEventListener("touchmove", handleTouchMove, { passive: false });

  return () => {
    el.removeEventListener("touchmove", handleTouchMove);
  };
}, [draggable]);


  const cardSpring = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 750, friction: 100 },
  });

const type = React.useMemo(() => {
    return item.instance_of[0] || "";
}, [item]);

  return (
    <Draggable draggableId={item.id} index={index} isDragDisabled={!draggable}>
      {(provided, snapshot) => {
        return (
          <div
  ref={(node) => {
    cardRef.current = node;
    provided.innerRef(node);
  }}
  className={classNames(styles.itemCard, {
     [styles.touchDragSurface]: draggable && !("played" in item),
    [styles.played]: "played" in item,
    [styles.flipped]: flipped,
    [styles.dragging]: snapshot.isDragging,
  })}
  {...provided.draggableProps}
  {...provided.dragHandleProps}
  onPointerDown={handlePointerDown}
  onPointerUp={handlePointerUpOrCancel}
  onPointerCancel={handlePointerUpOrCancel}
  onClick={() => {
    if ("played" in item && setFlippedId) {
      setFlippedId(flipped ? null : item.id);
    }
  }}
>
            <animated.div
              className={styles.front}
              style={{
                opacity: cardSpring.opacity.to((o) => 1 - o),
                transform: cardSpring.transform,
              }}
            >
              <div className={styles.top}>
                <div className={styles.label}>{capitalize(item.label)}</div>
                <div className={styles.description}>{capitalize(type)}</div>
              </div>
              <div
                className={styles.image}
                style={{
                  backgroundImage: `url("${createWikimediaImage(item.imageUrl || item.image)}")`,
                }}
              ></div>
              <animated.div
                className={classNames(styles.bottom, {
                  [styles.correct]: "played" in item && item.played.correct,
                  [styles.incorrect]: "played" in item && !item.played.correct,
                })}
              >
                <span>
                  {"played" in item
                    ? item.year < -10000
                      ? item.year.toLocaleString()
                      : item.year.toString()
                    : datePropIdMap[item.date_prop_id]}
                </span>
              </animated.div>
            </animated.div>
            <animated.div
              className={styles.back}
              style={{
                opacity: cardSpring.opacity,
                transform: cardSpring.transform.to(
                  (t) => `${t} rotateX(180deg) rotateZ(180deg)`
                ),
              }}
            >
              <span className={styles.label}>{capitalize(item.label)}</span>
              <span className={styles.date}>
                {capitalize(datePropIdMap[item.date_prop_id])}: {item.year}
              </span>
              <span className={styles.description}>{item.description}.</span>
              {item.category === "wiki" && item.wikipedia_title && (
  <a
    href={`https://www.wikipedia.org/wiki/${encodeURIComponent(
      item.wikipedia_title
    )}`}
    className={styles.wikipedia}
    target="_blank"
    rel="noopener noreferrer"
    onClick={(e) => {
      e.stopPropagation();
    }}
  >
    Wikipedia
  </a>
)}
            </animated.div>
          </div>
        );
      }}
    </Draggable>
  );
}
