import Layout from '../components/Layout';
import Hero from '../components/Hero';
import RulesSection from '../components/RulesSection';
import PlansSection from '../components/PlansSection';
import AboutSection from '../components/AboutSection';

export default function Home() {
  return (
    <Layout>
      <Hero />
      <RulesSection />
      <PlansSection />
      <AboutSection />
    </Layout>
  );
}