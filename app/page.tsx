"use client";

import React from "react";
import useClarity from "./lib/useClarity";
import NavigationBar from "../components/NavigationBar";
import HeroSection from "../components/HeroSection";
import PortfolioSection from "../components/PortfolioSection";
import DigitalPresenceSection from "../components/DigitalPresenceSection";
import SocialMediaManagementCertificateSection from "../components/SocialMediaManagementCertificateSection";
import EducationSection from "../components/EducationSection";
import ArticlesSection from "../components/ArticlesSection";
import NewsletterSection from "../components/NewsletterSection";
import Footer from "../components/Footer";

export default function Home() {
  useClarity(); // Call Clarity inside the component

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
