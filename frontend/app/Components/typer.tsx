import React, { useEffect, useRef } from "react";
import Typed from "typed.js";

const Typer: React.FC = () => {
  const typedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!typedRef.current) return;

    const options = {
      strings: [
        "Hungry's Feast",
        "Hungry for Indulgence",
        "Hungry for Experience",
        "Hungry for Deliciousness",
        "Hungry to Delight",
        "Hungry for Delights",
        "Hungry for Flavor",
        "Hungry to Savor",
        "Hungry's Gourmet Delights",
        "Hungry's Flavorful Fare",
        "Hungry's Culinary Treasures",
        "Hungry's Savory Satisfiers",
        "Hungry's Delectable Discoveries",
        "Hungry's Tasty Temptations",
        "Hungry's Epicurean Adventures",
        "Hungry's Delicious Discoveries",
        "Hungry's Satisfying Selections",
      ],
      typeSpeed: 75,
      backSpeed: 75,
      smartBackspace: true,
      loop: true,
    };

    const typed = new Typed(typedRef.current, options);

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <span
      ref={typedRef}
      className="welcome drop-shadow-xl drop"
      data-text="Welcome to Hungry"
    />
  );
};

export default Typer;
