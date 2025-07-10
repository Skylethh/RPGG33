import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import styles from '../styles/PrivacyPolicy.module.css'; // Aynı stil dosyasını kullanıyoruz

export default function Disclaimer() {
  return (
    <Layout>
      <Head>
        <title>Disclaimer | SAGAI</title>
        <meta name="description" content="Disclaimer for SAGAI" />
      </Head>
      
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Disclaimer</h1>
          <div className={styles.divider}></div>
          <p className={styles.subtitle}>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Introduction</h2>
            <p>The information provided on SAGAI ("the Service") is for general informational and entertainment purposes only. All content and materials available on this website are provided "as is" and without any warranties, expressed or implied.</p>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. No Professional Advice</h2>
            <p>The content of SAGAI is not intended to be a substitute for professional advice. Users should not construe any information on this site as professional advice of any kind.</p>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Accuracy and Completeness</h2>
            <p>While we strive to keep the information on our website accurate, complete, and up-to-date, we make no representations or warranties about the accuracy, completeness, or reliability of any content. Any reliance you place on such information is strictly at your own risk.</p>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. User-Generated Content</h2>
            <p>SAGAI may include content provided by users. We do not control, verify, endorse, or adopt any user-generated content, and we cannot guarantee the accuracy, integrity, quality, or appropriateness of such content.</p>
            <p>Users are solely responsible for the content they submit, and such content does not necessarily reflect the views of SAGAI.</p>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Intellectual Property</h2>
            <p>SAGAI respects intellectual property rights and expects users to do the same. Our service may contain references to third-party intellectual property, including trademarks, service marks, and copyrights, which are the property of their respective owners.</p>
            <p>SAGAI is not affiliated with, endorsed by, or officially connected with any tabletop role-playing game publishers unless explicitly stated.</p>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. External Links</h2>
            <p>Our Service may contain links to external websites that are not operated by us. We have no control over the content and practices of these sites and cannot accept responsibility or liability for their respective privacy policies or practices.</p>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Limitation of Liability</h2>
            <p>To the maximum extent permitted by applicable law, SAGAI, its owners, employees, agents, and affiliates shall not be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in any way connected with:</p>
            <ul className={styles.list}>
              <li>Your use of or inability to use the Service</li>
              <li>Any content available on or through the Service</li>
              <li>Any action taken in connection with an investigation by SAGAI or law enforcement authorities</li>
              <li>Any errors or omissions in the Service's content</li>
              <li>Any damage to your computer, mobile device, or other equipment</li>
            </ul>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Indemnification</h2>
            <p>You agree to defend, indemnify, and hold harmless SAGAI, its owners, employees, contractors, agents, and affiliates from and against any claims, liabilities, damages, losses, and expenses, including without limitation reasonable attorney fees and costs, arising out of or in any way connected with your access to or use of the Service or your violation of these terms.</p>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Changes to This Disclaimer</h2>
            <p>We may update our Disclaimer from time to time. We will notify you of any changes by posting the new Disclaimer on this page and updating the "Last Updated" date.</p>
            <p>You are advised to review this Disclaimer periodically for any changes. Changes to this Disclaimer are effective when they are posted on this page.</p>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Contact Us</h2>
            <p>If you have any questions about this Disclaimer, please contact us at:</p>
            <p className={styles.contactInfo}>Email: legal@sagai.com</p>
          </section>
        </div>
      </div>
    </Layout>
  );
}