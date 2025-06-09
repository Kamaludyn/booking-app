import Hero from "../components/Hero";
import FeaturedServices from "../components/FeaturedServices";
import HowItWorks from "../components/HowItWorks";
import WhyChooseUs from "../components/WhyChooseUs";
import Footer from "../components/Footer";

export default function BookingPage() {
  return (
    <main>
      {/* Hero Section */}
      <Hero />

      {/* Featured Services */}
      <FeaturedServices />

      {/* How It Works */}
      <HowItWorks />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/*Footer / CTA Section */}
      <Footer />
    </main>
  );
}
