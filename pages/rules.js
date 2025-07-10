import Layout from '../components/Layout';
  import RulebookPage from '../components/rulebook/RulebookPage';

  export default function Rules() {
    return (
      <Layout title="Game Rules | SAGAI">
        <div className="rules-page">
          <div className="container">
            <RulebookPage />
          </div>
        </div>
      </Layout>
    );
  }