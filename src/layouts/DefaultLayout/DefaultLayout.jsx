import Header from "../components/Header";
import Footer from "../components/Footer";

function DefaultLayout({ children }) {
  return (
    <div className="wrapper relative">
      <Header />
      <div className="body overflow-hidden">{children}</div>
      <Footer />
    </div>
  );
}

export default DefaultLayout;
