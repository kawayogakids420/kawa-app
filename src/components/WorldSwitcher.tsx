"use client";
import { useKawa } from "@/lib/context";
import { WORLDS } from "@/lib/worlds";
import styles from "./WorldSwitcher.module.css";

export default function WorldSwitcher() {
  const { worldId, setWorldId, world } = useKawa();

  return (
    <div className={styles.switcher}>
      <p className={styles.label}>🌍 Mundo</p>
      <div className={styles.pills}>
        {WORLDS.map((w) => (
          <button
            key={w.id}
            className={`${styles.pill} ${worldId === w.id ? styles.active : ""}`}
            style={
              worldId === w.id
                ? { background: w.accent, color: "white" }
                : { background: w.bg, color: w.accent, border: `1.5px solid ${w.accent}` }
            }
            onClick={() => setWorldId(w.id)}
          >
            {w.name}
          </button>
        ))}
      </div>
    </div>
  );
}
