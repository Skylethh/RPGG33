import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import styles from '../styles/PrivacyPolicy.module.css';

export default function PrivacyPolicy() {
  return (
    <Layout>
      <Head>
        <title>Privacy Policy | SAGAI</title>
        <meta name="description" content="Privacy Policy for SAGAI" />
      </Head>
      
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <div className={styles.divider}></div>
          <p className={styles.subtitle}>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Introduction</h2>
            <p>At SAGAI, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.</p>
            <p>Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the site.</p>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Information We Collect</h2>
            <p>We collect information that you provide directly to us when you:</p>
            <ul className={styles.list}>
              <li>Create an account</li>
              <li>Create and save character data</li>
              <li>Participate in interactive features</li>
              <li>Contact customer support</li>
              <li>Complete forms on our website</li>
            </ul>
            
            <p>The types of information we may collect include:</p>
            <ul className={styles.list}>
              <li>Personal identifiers (name, email address)</li>
              <li>Account credentials</li>
              <li>User-generated content (character data, game sessions)</li>
              <li>Payment information (if applicable)</li>
              <li>Device information and usage data</li>
            </ul>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. How We Use Your Information</h2>
            <p>We use the information we collect for various purposes, including to:</p>
            <ul className={styles.list}>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and manage your account</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Develop new products and services</li>
              <li>Monitor and analyze usage patterns</li>
              <li>Protect against, identify, and prevent fraud and other illegal activity</li>
            </ul>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Data Storage and Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage.</p>
            <p>While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security. Any transmission of personal information is at your own risk.</p>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Data Retention</h2>
            <p>We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.</p>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Your Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
            <ul className={styles.list}>
              <li>The right to access your personal data</li>
              <li>The right to rectify inaccurate personal data</li>
              <li>The right to request deletion of your personal data</li>
              <li>The right to restrict processing of your personal data</li>
              <li>The right to data portability</li>
              <li>The right to object to processing of your personal data</li>
            </ul>
            <p>To exercise these rights, please contact us using the information provided in the "Contact Us" section.</p>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Children's Privacy</h2>
            <p>Our service is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we can take necessary actions.</p>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Changes to This Privacy Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.</p>
            <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p className={styles.contactInfo}>Email: privacy@sagai.com</p>
          </section>
        </div>
      </div>
    </Layout>
  );
}