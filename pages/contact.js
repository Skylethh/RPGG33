import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import styles from '../styles/Contact.module.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Here you would typically send the form data to your backend
    // For now, we'll just simulate a successful submission
    setFormStatus({
      submitted: true,
      success: true,
      message: 'Thank you for your message! We will get back to you soon.'
    });
    
    // Reset form after successful submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <Layout>
      <Head>
        <title>Contact Us | SAGAI</title>
        <meta name="description" content="Contact SAGAI for questions, support, or feedback" />
      </Head>
      
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Contact Us</h1>
          <div className={styles.divider}></div>
          <p className={styles.subtitle}>Have questions or feedback? We'd love to hear from you!</p>
        </div>
        
        <div className={styles.content}>
          <div className={styles.contactInfo}>
            <div className={styles.infoCard}>
              <h3>Email</h3>
              <p>support@sagai.com</p>
            </div>
            
            <div className={styles.infoCard}>
              <h3>Social Media</h3>
              <p>Connect with us on <a href="https://discord.gg/sagai" target="_blank" rel="noopener noreferrer">Discord</a>, <a href="https://twitter.com/sagai" target="_blank" rel="noopener noreferrer">Twitter</a>, or <a href="https://reddit.com/r/sagai" target="_blank" rel="noopener noreferrer">Reddit</a>.</p>
            </div>
            
            <div className={styles.infoCard}>
              <h3>Response Time</h3>
              <p>We typically respond to inquiries within 1-2 business days.</p>
            </div>
          </div>
          
          <div className={styles.contactForm}>
            <h2>Send Us a Message</h2>
            
            {formStatus.submitted && formStatus.success ? (
              <div className={styles.successMessage}>
                <p>{formStatus.message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="subject">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="message">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    rows="5" 
                    required 
                  ></textarea>
                </div>
                
                <button type="submit" className={styles.submitButton}>Send Message</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}