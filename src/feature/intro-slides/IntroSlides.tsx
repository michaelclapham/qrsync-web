import React from "react";
import slide1 from "./slide_1.svg";
import slide2 from "./slide_2.svg";
import slide3 from "./slide_3.svg";

export const IntroSlides: React.FC<{}> = () => {
  return <div className="introSlider">
    <img src={slide1}></img>
    <img src={slide2}></img>
    <img src={slide3}></img>
  </div>;
};
