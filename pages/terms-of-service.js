import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import styles from '../styles/TermsOfService.module.css';

export default function TermsOfService() {
  return (
    <Layout>
      <Head>
        <title>Terms of Service | SAGAI</title>
        <meta name="description" content="Terms of Service for SAGAI" />
      </Head>
      
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Terms of Service</h1>
          <div className={styles.divider}></div>
          <p className={styles.subtitle}>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Acceptance of Terms</h2>
            <p>By accessing or using SAGAI ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Description of Service</h2>
            <p>SAGAI is a digital platform that provides tools for creating and managing characters for tabletop role-playing games. The Service includes character creation, management, and gameplay assistance features.</p>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. User Accounts</h2>
            <p>Some features of the Service may require you to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. User Content</h2>
            <p>You retain ownership of any content you create using the Service, including character sheets, stories, and other game-related materials. However, by using the Service, you grant us a non-exclusive, royalty-free license to use, store, and display your content solely for the purpose of providing and improving the Service.</p>
            <p>You agree not to create or share content that:</p>
            <ul className={styles.list}>
              <li>Infringes on the intellectual property rights of others</li>
              <li>Contains offensive, harmful, or illegal material</li>
              <li>Violates the privacy or rights of others</li>
              <li>Contains malware, viruses, or other harmful code</li>
            </ul>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Intellectual Property</h2>
            <p>The Service, including its design, features, and content provided by SAGAI, is protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of the Service without our explicit permission.</p>
            <p>SAGAI respects the intellectual property of others. If you believe that your work has been used in a way that constitutes copyright infringement, please contact us.</p>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Privacy</h2>
            <p>Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using the Service, you agree to our collection and use of information as described in the Privacy Policy.</p>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, SAGAI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:</p>
            <ul className={styles.list}>
              <li>Your use or inability to use the Service</li>
              <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
              <li>Any interruption or cessation of transmission to or from the Service</li>
              <li>Any bugs, viruses, or other harmful code that may be transmitted through the Service</li>
            </ul>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Modifications to the Service and Terms</h2>
            <p>We reserve the right to modify or discontinue the Service at any time without notice. We may also revise these Terms of Service from time to time. The most current version will always be posted on this page. By continuing to use the Service after any changes, you accept the revised terms.</p>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Termination</h2>
            <p>We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms of Service. Upon termination, your right to use the Service will immediately cease.</p>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which SAGAI operates, without regard to its conflict of law provisions.</p>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>11. Contact Us</h2>
            <p>If you have any questions about these Terms of Service, please contact us at support@sagai.com.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
}