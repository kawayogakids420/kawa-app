"use client";
import { useKawa } from "@/lib/context";
import styles from "./AdultasScreen.module.css";
import { useState } from "react";

const SENSOR_PROFILES = [
  { id: "sensible", label: "Muy Sensible", color: "#F0D8DC", dot: "#D4607A", active: true },
  { id: "buscador", label: "Buscador/a",   color: "#F0EDCC", dot: "#B8A020", active: false },
  { id: "bajo",     label: "Bajo Registro",color: "#D8EAF0", dot: "#4A8AA8", active: false },
  { id: "planif",   label: "Planif. Motora",color: "#D8EED8", dot: "#4A8A4A", active: false },
];

export default function AdultasScreen() {
  const { world, userName } = useKawa();
  const [adultoTab, setAdultoTab] = useState<"perfil" | "recursos" | "niño">("perfil");

  return (
    <div className={styles.screen}>
      {/* Dark green header */}
      <div className={styles.header} style={{ background: world.heroBg }}>
        <div className={styles.headerRow}>
          <div className={styles.avatarCircle} />
          <div>
            <span className={styles.eyebrow}>NIÑO/A</span>
            <h2 className={styles.name}>{userName}</h2>
            <span className={styles.chip} style={{ background: "rgba(255,255,255,0.25)", color: "white" }}>
              Muy Sensible · 3-4 años
            </span>
          </div>
          <span className={styles.chevron}>›</span>
        </div>
      </div>

      <div className={styles.body} style={{ background: "#F9F5F0" }}>
        {/* Usage type */}
        <p className={styles.sectionLabel}>¿CÓMO USAS LA APP?</p>
        <div className={styles.usageRow}>
          <button
            className={styles.usageCard}
            style={{ borderColor: world.accent, borderWidth: 2 }}
          >
            <div className={styles.usageImg} style={{ background: "#F0EBE3" }} />
            <span className={styles.usageTitle}>Familia</span>
            <span className={styles.usageSub}>Guía para casa</span>
          </button>
          <button className={styles.usageCard}>
            <div className={styles.usageImg} style={{ background: "#EBF0EB" }} />
            <span className={styles.usageTitle}>Profesional</span>
            <span className={styles.usageSub}>Terapeuta / salud</span>
          </button>
        </div>

        <button className={styles.addBtn} style={{ borderColor: world.accent, color: world.accent }}>
          + Agregar niño/a
        </button>

        {/* Sensory info */}
        <div className={styles.infoBox} style={{ borderLeftColor: world.accent }}>
          <span
            className={styles.infoDot}
            style={{ background: world.accent }}
          />
          <p className={styles.infoText}>
            Perfil predominante: <strong>Muy Sensible.</strong> Percibe el
            mundo con gran intensidad; necesita suavidad.
          </p>
        </div>

        {/* Sensory profiles grid */}
        <p className={styles.sectionLabel}>PERFILES SENSORIALES</p>
        <div className={styles.sensorGrid}>
          {SENSOR_PROFILES.map((sp) => (
            <div
              key={sp.id}
              className={`${styles.sensorCard} ${sp.active ? styles.sensorActive : ""}`}
              style={{ background: sp.color }}
            >
              {sp.active && (
                <span className={styles.tuPerfil} style={{ background: world.accent }}>
                  Tu perfil
                </span>
              )}
              <div className={styles.sensorImg} />
              <div className={styles.sensorFooter}>
                <span className={styles.sensorDot} style={{ background: sp.dot }} />
                <span className={styles.sensorLabel}>{sp.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sub-tabs */}
      <nav className={styles.subNav}>
        {(["perfil", "recursos", "niño"] as const).map((t) => (
          <button
            key={t}
            className={`${styles.subTab} ${adultoTab === t ? styles.subActive : ""}`}
            style={adultoTab === t ? { color: world.accent, borderTopColor: world.accent } : {}}
            onClick={() => setAdultoTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </nav>
    </div>
  );
}
