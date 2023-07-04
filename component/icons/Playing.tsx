import { HTMLAttributes } from "react";
import styles from "./Playing.module.css";

export default function PlayingIcon(props: HTMLAttributes<SVGSVGElement>) {
  return (
    <svg
      height="24px"
      strokeWidth="4"
      viewBox="-12 -12 24 24"
      width="24px"
      {...props}
    >
      <g>
        <line x1="-6" x2="-6" y1="8" y2="-8" className={styles.left}></line>
        <line x1="0" x2="0" y1="8" y2="-8" className={styles.middle}></line>
        <line x1="6" x2="6" y1="8" y2="-8" className={styles.right}></line>
      </g>
    </svg>
  );
}
