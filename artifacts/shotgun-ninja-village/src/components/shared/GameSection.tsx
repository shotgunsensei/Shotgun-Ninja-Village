import { ArrowUpRight } from "lucide-react";
import { GameLink } from "./GameLink";

export function GameSection() {
  return (
    <section
      id="game"
      className="village-game-section"
      aria-labelledby="village-game-title"
    >
      <div className="village-game-art">
        <img
          src={`${import.meta.env.BASE_URL}images/kage-9-operator.webp`}
          width="896"
          height="1280"
          loading="lazy"
          decoding="async"
          alt="Kage-9 character concept in red armor, with cyan visor and core"
        />
        <span>Original character art / Kage-9</span>
      </div>
      <div className="village-game-copy">
        <p className="eyebrow">Shotgun Ninjas / The game</p>
        <h2 id="village-game-title">
          Kage-9's <br />
          <span>next chapter.</span>
        </h2>
        <p className="game-launch-status">Game website</p>
        <p>
          Step beyond the transmissions. An original Shotgun Ninjas action game
          follows Kage-9 into the next chapter of the village.
        </p>
        <GameLink className="brand-button">
          Visit game website <ArrowUpRight size={18} aria-hidden="true" />
        </GameLink>
        <p className="game-launch-note">
          Explore the game at <span>kage.operatoros.net</span>.
        </p>
      </div>
    </section>
  );
}
