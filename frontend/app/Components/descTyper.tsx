import React, { useEffect, useRef } from "react";
import Typed from "typed.js";

const Typer: React.FC = () => {
  const typedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!typedRef.current) return;

    const options = {
      strings: [
        "🍴 Step into the extraordinary world of HUNGRY, where culinary magic happens! 🌟 Explore our bustling marketplace, where sellers unveil their gourmet masterpieces and users embark on flavorful escapades. 🍔🍰 Indulge in artisanal delights, savor exotic delicacies, and ignite your taste buds with a symphony of flavors. 🎉 Join our vibrant community of food aficionados and immerse yourself in the thrill of culinary exploration! 🥳 Arrive with an appetite, depart with a smile because at HUNGRY, every meal is a journey worth celebrating!"
      ],
      typeSpeed: 15,
    };

    const typed = new Typed(typedRef.current, options);

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <span
      ref={typedRef}
      className="w-4/5 text-2xl text-yellow-300 flex justify-center align-middle text-center mx-auto m-10 absolut description"
    />
  );
};

export default Typer;
