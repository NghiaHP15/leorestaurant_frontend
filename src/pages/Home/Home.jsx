import AboutUs from "./AboutUs";
import Slider from "./Slider";
import ListCategory from "./ListCategory1/ListCategory1";
import AboutStyle from "./AboutStyle";
import ListItem from "./ListItem1/ListItem";
import Gallery from "./Gallery";
import Blog from "./Blog";
import Trend from "./Trend/Trend";
import MenuHome from "./MenuHome";
import * as RecipeService from "../../services/RecipeService";
import * as MenuSevice from "../../services/MenuSevice";
import * as BannerService from "../../services/BannerService";
import * as GalleryService from "../../services/GalleryService";
import * as BlogService from "../../services/BlogService";
import * as InforService from "../../services/InforService";
import * as ComboService from "../../services/ComboService";
import { useState } from "react";
import { useEffect } from "react";

function Home() {
  const [bestNew, setBestNew] = useState([]);
  const [bestSale, setBestSale] = useState([]);
  const [menu, setMenu] = useState([]);
  const [slider, setSlider] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [socalMedia, setSocalMedia] = useState([]);
  const [blog, setBlog] = useState([]);
  const [aboutUs, setAbouUs] = useState([]);
  const [aboutStyle, setAboutStyle] = useState([]);
  const [combo, setCombo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [
        resultBestNew,
        resultBestSale,
        resultMenu,
        resultSlider,
        resultGallery,
        resultSocalMedia,
        resultBlog,
        resultAbout,
        resultCombo,
      ] = await Promise.all([
        RecipeService.getBestNew(),
        RecipeService.getBestSale(),
        MenuSevice.listMenu(),
        BannerService.listSlider(),
        GalleryService.listGallerySub(),
        GalleryService.listSocalMedia(),
        BlogService.listBlogShow(),
        InforService.getInfor(),
        ComboService.listCombo(),
      ]);
      setBestNew(resultBestNew.data);
      setBestSale(resultBestSale.data);
      setMenu(resultMenu.data);
      setSlider(resultSlider.data);
      setGallery(resultGallery.data);
      setSocalMedia(resultSocalMedia.data);
      setBlog(resultBlog.data);
      setAbouUs(resultAbout.data[0]);
      setAboutStyle(resultAbout.data[0]);
      setCombo(resultCombo.data);
    };
    fetchData();
  }, []);

  return (
    <>
      <Slider data={slider} />
      <MenuHome data={menu} />
      <AboutUs data={aboutUs} />
      <ListCategory data={combo} />
      <AboutStyle data={aboutStyle} />
      <ListItem rounded data={bestNew} title={"Best new"} />
      <ListItem rounded data={bestSale} title={"Best sales"} />
      <Gallery data={gallery} />
      <Blog data={blog} />
      <Trend data={socalMedia} />
    </>
  );
}

export default Home;
