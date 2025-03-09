import Layout from '../components/Layout';
import Hero from '../components/Hero';
import RulesSection from '../components/RulesSection';
import PlansSection from '../components/PlansSection';

export default function Home() {
  return (
    <Layout>
      <Hero />
      <RulesSection />
      <PlansSection />
    </Layout>
  );
}