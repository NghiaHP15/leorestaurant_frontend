import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

function DefaultLayout({ children }) {
  return (
    <div className="wrapper">
      <Header />
      <div className="container">
        <Sidebar />
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default DefaultLayout;
