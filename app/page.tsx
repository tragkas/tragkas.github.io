import React from "react";
import NavigationBar  from "../components/NavigationBar";
import HeroSection  from "../components/HeroSection";
import PortfolioSection from "../components/PortfolioSection";
import DigitalPresenceSection from "../components/DigitalPresenceSection"
import SocialMediaManagementCertificateSection from "../components/SocialMediaManagementCertificateSection";
import EducationSection from "../components/EducationSection";
import ArticlesSection from "../components/ArticlesSection";
import NewsletterSection from "../components/NewsletterSection";
import Footer  from "../components/Footer";

// Export all components together
export default function Home() {
  return (
    <>
      <NavigationBar />
      <HeroSection />
      <PortfolioSection />
      <DigitalPresenceSection />
      <SocialMediaManagementCertificateSection />
      <EducationSection />
      <ArticlesSection />
      <NewsletterSection />
      <Footer />
    </>
  );
}