import React, { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import images from "../../src/images";
import AOS from "aos";
import "aos/dist/aos.css";

function ImagePage() {
  useEffect(() => {
    AOS.init({
      // Global settings:
      disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
      startEvent: "DOMContentLoaded", // name of the event dispatched on the document, that AOS should initialize on
      initClassName: "aos-init", // class applied after initialization
      animatedClassName: "aos-animate", // class applied on animation
      useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
      disableMutationObserver: false, // disables automatic mutations' detections (advanced)
      debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
      throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)

      // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
      offset: 120, // offset (in px) from the original trigger point
      delay: 0, // values from 0 to 3000, with step 50ms
      duration: 1000, // values from 0 to 3000, with step 50ms
      easing: "ease", // default easing for AOS animations
      once: false, // whether animation should happen only once - while scrolling down
      mirror: false, // whether elements should animate out while scrolling past them
    });
  }, []);

  const menuColor = "rgba(217,178,130,255)";
  const getRandomHeight = (min, max) => {
    return Math.floor(Math.random() * (max - min + 2) + min);
  };
  const ensureArrayLength = (array, minLength) => {
    const originalLength = array.length;
    if (originalLength >= minLength) {
      return array.slice(0, minLength);
    } else {
      const copiedArray = array.slice(); // Copy the original array
      while (copiedArray.length < minLength) {
        // Duplicate elements until the length reaches the minimum required
        copiedArray.push(...copiedArray.slice(0, minLength - copiedArray.length));
      }
      return copiedArray;
    }
  };
  
  const preitems = [
    { image: images.menu1 },
    { image: images.menu2 },
    { image: images.menu3 },
    { image: images.menu4 },
    { image: images.menu5 },
    { image: images.menu6 },
    { image: images.restaurant1 },
    { image: images.restaurant2 },
    { image: images.restaurant3 },
  ];
  
  const items = ensureArrayLength(preitems, 50);

  // Function to shuffle array randomly
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  // Function to chunk array into groups of given size
  const chunkArray = (array, size) => {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
      array.slice(index * size, index * size + size)
    );
  };

  const shuffledItems = shuffleArray(items); // Shuffle the items array
  const columnItems = chunkArray(
    shuffledItems,
    Math.ceil(shuffledItems.length / 4)
  ); // Chunk the shuffled items into 4 arrays with roughly equal length

  return (
    <div class="flex overflow-hidden w-screen h-full">
      <div class=" flex-grow-1 flex-shrink-1 bg-cover bg-center  h-screen w-full"></div>
      <div class="flex-shrink-0 flex-row flex justify-content-center surface-0 h-full w-10">
        {columnItems.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className="flex-column flex flex-wrap col-3 h-full"
          >
            {column.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="w-full bg-cover bg-center m-2 border-round cursor-pointer border-1  hover:border-orange-500"
                data-aos="fade-up"
                data-aos-delay={`${itemIndex * 100}`}
                style={{ height: `${getRandomHeight(20, 30)}rem`, background: `url(${item.image})` }}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <div class=" flex-grow-1 flex-shrink-1 bg-cover bg-center h-screen w-full"></div>
    </div>
  );
}

export default ImagePage;
