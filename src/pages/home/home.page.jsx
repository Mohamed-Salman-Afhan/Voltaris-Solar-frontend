import HeroSection from "./components/HeroSection";
import EnergySection from "./components/EnergySection";
import ProblemSection from "./components/ProblemSection";
import SolutionSection from "./components/SolutionSection";
import UserProfileSection from "./components/UserProfileSection";
import Footer from "./components/Footer";

const HomePage = () => {
  return (
    <main>
      <HeroSection />
      <EnergySection />
      <ProblemSection />
      <SolutionSection />
      <UserProfileSection />
      <Footer />
    </main>
  );
};

export default HomePage;
