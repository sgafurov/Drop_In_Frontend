// import React, { useEffect, useState } from "react";
// import AutoSearch from "./AutoSearch";
// import "../styles/Landing.css";
// import image1 from "../images/1.jpg";
// import image2 from "../images/2.jpg";
// import image3 from "../images/3.jpg";
// import image4 from "../images/4.jpg";
// import image5 from "../images/5.jpg";
// import image6 from "../images/6.jpg";

// export default function Landing() {
//   const [backgroundImage, setBackgroundImage] = useState(0);
//   const backgrounds = [image1, image2, image3, image4, image5, image6];

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setBackgroundImage((prevIndex) =>
//         prevIndex < backgrounds.length - 1 ? prevIndex + 1 : 0
//       );
//     }, 7000);
//     return () => clearInterval(intervalId);
//   }, [backgrounds.length]);

//   return (
//     <div
//       className="landing-page"
//       style={{
//         backgroundImage: `url(${backgrounds[backgroundImage]})`,
//       }}
//     >
//       <div className="landing-search">
//         <h1 className="landing-title">DROP-IN</h1>

//         <AutoSearch />
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import AutoSearch from "./AutoSearch";
import "../styles/Landing.css";
import image1 from "../images/1.jpg";
import image2 from "../images/2.jpg";
import image3 from "../images/3.jpg";
import image4 from "../images/4.jpg";
import image5 from "../images/5.jpg";
import image6 from "../images/6.jpg";

export default function Landing() {
  const [backgroundImage, setBackgroundImage] = useState(0);
  const backgrounds = [image1, image2, image3, image4, image5, image6];

  const preloadImages = () => {
    backgrounds.forEach((imageSrc) => {
      const img = new Image();
      img.src = imageSrc;
    });
  };

  useEffect(() => {
    preloadImages();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBackgroundImage((prevIndex) =>
        prevIndex < backgrounds.length - 1 ? prevIndex + 1 : 0
      );
    }, 5000);
    return () => clearInterval(intervalId);
  }, [backgrounds.length]);

  return (
    <div
      className="landing-page"
      style={{
        backgroundImage: `url(${backgrounds[backgroundImage]})`,
      }}
    >
      <div className="landing-search">
        <h1 className="landing-title">DROP-IN</h1>
        <AutoSearch />
      </div>
    </div>
  );
}
