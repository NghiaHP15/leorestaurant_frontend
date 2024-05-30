import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as GalleryService from "../../../services/GalleryService";
import { Image } from "primereact/image";
import { useEffect } from "react";
import { useState } from "react";

function ImagePage() {
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await GalleryService.listGallery();
      const items = ensureArrayLength(result.data, 50);
      setGallery(items);
    };
    fetchData();
  }, []);

  const ensureArrayLength = (array, minLength) => {
    const originalLength = array.length;
    if (originalLength >= minLength) {
      return array.slice(0, minLength);
    } else {
      const copiedArray = array.slice(); // Copy the original array
      while (copiedArray.length < minLength) {
        // Duplicate elements until the length reaches the minimum required
        copiedArray.push(
          ...copiedArray.slice(0, minLength - copiedArray.length)
        );
      }
      return copiedArray;
    }
  };

  // const items =  ensureArrayLength(gallery, 20);

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

  const shuffledItems = shuffleArray(gallery); // Shuffle the items array
  const columnItems = chunkArray(
    shuffledItems,
    Math.ceil(shuffledItems.length / 4)
  ); // Chunk the shuffled items into 4 arrays with roughly equal length

  return (
    <div className="flex overflow-hidden container container-custom h-full mt-4">
      <div className=" flex-grow-1 flex-shrink-1 bg-cover bg-center  h-screen w-full"></div>
      <div className="flex-shrink-0 flex-row flex justify-content-center surface-0 h-full w-full ">
        {columnItems.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className="flex-column flex flex-wrap col-3 h-full"
          >
            {column.map((item, itemIndex) => {
              return (
                <div
                  key={itemIndex}
                  className="w-full m-2"
                  data-aos="fade-up"
                  data-aos-delay={`${itemIndex * 100}`}
                >
                  <Image
                    src={item.image}
                    alt="image"
                    preview
                    className={`w-full`}
                    width="100%"
                    pt={{
                      mask: "z-9999",
                    }}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className=" flex-grow-1 flex-shrink-1 bg-cover bg-center h-screen w-full"></div>
    </div>
  );
}

export default ImagePage;
