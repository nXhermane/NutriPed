import React from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { VisionSection } from '../components/sections/VisionSection';
import { ContextSection } from '../components/sections/ContextSection';


export const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <ContextSection />
      <VisionSection />
    </>
  );
};
