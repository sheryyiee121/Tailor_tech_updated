import Footer from "../../components/common/footer";
import Navbar from "../../components/common/navbar";
import BlogSection from "../../components/Hero/Blog";
import Fashion from "../../components/Hero/Fashion";
import HeroEnhanced from "../../components/Hero/HeroEnhanced";
import TechnologySection from "../../components/Hero/Technology";

function Home() {
  return (
    <>
      <Navbar />
      <HeroEnhanced />
      <BlogSection />
      <TechnologySection />
      <Fashion />
      <Footer />
    </>
  );
}

export default Home;
