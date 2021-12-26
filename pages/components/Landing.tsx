import React from "react";

import Hero from "../components/sections/Hero";
import LandingLayout from "../components/layouts/Layout";

export default function Landing() {
  return (
    <LandingLayout>
      <Hero
        title="A Map for your DAO Members"
        subtitle="MapMyDAO is a neat app that allows DAO members to easily locate each other and share information about their DAO."
        image="https://source.unsplash.com/collection/404339/800x600"
        ctaLink="/auth/login"
      />
    </LandingLayout>
  );
}
