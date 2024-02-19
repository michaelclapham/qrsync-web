import React, { CSSProperties } from "react";
import slide1 from "./slide_1.svg";
import slide2 from "./slide_2.svg";
import slide3 from "./slide_3.svg";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import "./slides.css";

export interface IntroSlidesProps {
  style: CSSProperties | undefined;
}

export const IntroSlides: React.FC<IntroSlidesProps> = ({ style }) => {
  return (
    <div className="introSlider" style={style}>
      <Carousel
        showThumbs={false}
        showStatus={false}
        autoPlay={true}
        interval={3500}
        infiniteLoop={true}
      >
        <div className="introSlide">
          <img src={slide1} alt="A phone moving data to a laptop" />
          <p className="slideDescription">
            QR Sync allows you to sync notes and files between devices for free!
          </p>
        </div>
        <div className="introSlide">
          <img
            src={slide2}
            alt="A phone and laptop both with the Qr sync website open"
          />
          <p className="slideDescription">
            Open QR Sync on multiple devices, and scan one with the other to
            connect them.
          </p>
        </div>
        <div className="introSlide">
          <img
            src={slide3}
            alt="Files and notes being moved from a phone to a laptop"
          />
          <p className="slideDescription">
            Then you can move notes and files between them. Simple!
          </p>
        </div>
      </Carousel>
    </div>
  );
};
