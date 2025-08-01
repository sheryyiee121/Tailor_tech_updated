import Footer from "../../components/common/footer";
import Navbar from "../../components/common/navbar";
import BlogSection from "../../components/Hero/Blog";
import Fashion from "../../components/Hero/Fashion";
import Heroo from "../../components/Hero/Heroo";
import TechnologySection from "../../components/Hero/Technology";

function Home() {
  return (
    <>
      <Navbar />
      <Heroo />
      <BlogSection />
      <TechnologySection />
      <Fashion />
      <Footer />
    </>
  );
}

export default Home;
