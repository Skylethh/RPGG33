import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout';
import styles from '../styles/Profile.module.css';
import { FaUser, FaEnvelope, FaLock, FaCrown, FaTrash, FaSignOutAlt, FaEdit } from 'react-icons/fa';
import { supabase } from '../lib/supabase'; // Supabase'i içe aktar

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  if (!user) {
    return (
      <Layout>
        <div className={styles.container}>
          <p>Please log in to view your profile.</p>
        </div>
      </Layout>
    );
  }

  const handleUsernameChange = async (e) => {
    e.preventDefault();
    if (newUsername.trim() === '') {
        setMessage({ type: 'error', content: 'Username cannot be empty.' });
        return;
    }
    
    const { data, error } = await supabase.auth.updateUser({
        data: { username: newUsername }
    });

    if (error) {
        setMessage({ type: 'error', content: `Failed to update username: ${error.message}` });
    } else {
        setMessage({ type: 'success', content: 'Username updated successfully!' });
        setIsEditingUsername(false);
        // Kullanıcı arayüzünü anında güncellemek için state'i manuel olarak güncelleyebilir veya AuthContext'te bir yenileme fonksiyonu çağırabiliriz.
        // Şimdilik, sayfa yenilendiğinde güncel veri görünecektir.
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', content: 'Passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
        setMessage({ type: 'error', content: 'Password must be at least 6 characters long.' });
        return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage({ type: 'error', content: `Failed to update password: ${error.message}` });
    } else {
      setMessage({ type: 'success', content: 'Password updated successfully!' });
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Burada, veritabanından kullanıcıyla ilişkili tüm verileri silmek için bir server-side fonksiyon çağırmak en iyisidir.
      // Örneğin: await supabase.rpc('delete_user')
      // Şimdilik sadece Auth'dan sileceğiz.
      console.log('Delete account initiated for user:', user.id);
      // Bu fonksiyonun `AuthContext` içinde tanımlanması ve oradan çağrılması daha doğru olur.
      // const { error } = await supabase.auth.api.deleteUser(user.id) // Bu admin yetkisi gerektirir.
       setMessage({ type: 'error', content: 'Account deletion is not yet implemented.' });
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>My Profile</h1>
        
        {message.content && <div className={`${styles.message} ${styles[message.type]}`}>{message.content}</div>}

        <div className={styles.profileGrid}>
          {/* User Info */}
          <div className={styles.profileCard}>
            <h2 className={styles.cardTitle}><FaUser /> User Information</h2>
            <div className={styles.userInfo}>
                <strong>Username:</strong> 
                {isEditingUsername ? (
                    <form onSubmit={handleUsernameChange} className={styles.usernameForm}>
                        <input 
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            placeholder="Enter new username"
                            className={styles.usernameInput}
                        />
                        <button type="submit" className={styles.smallButton}>Save</button>
                    </form>
                ) : (
                    <span>
                        {user.user_metadata?.username || 'N/A'}
                        <button onClick={() => { setIsEditingUsername(true); setNewUsername(user.user_metadata?.username || ''); }} className={styles.editButton}>
                            <FaEdit />
                        </button>
                    </span>
                )}
            </div>
            <p><strong>Email:</strong> {user.email}</p>
          </div>

          {/* Subscription Plan */}
          <div className={styles.profileCard}>
            <h2 className={styles.cardTitle}><FaCrown /> Subscription</h2>
            <p><strong>Current Plan:</strong> <span className={styles.planFree}>Free</span></p> 
            <button className={`${styles.button} ${styles.upgradeButton}`} disabled>Upgrade to Premium</button>
          </div>

          {/* Change Password */}
          <div className={styles.profileCard}>
            <h2 className={styles.cardTitle}><FaLock /> Change Password</h2>
            <form onSubmit={handlePasswordChange}>
              <div className={styles.inputGroup}>
                <input 
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <input 
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className={`${styles.button} ${styles.updateButton}`}>Update Password</button>
            </form>
          </div>

          {/* Account Actions */}
          <div className={`${styles.profileCard} ${styles.actionsCard}`}>
            <h2 className={styles.cardTitle}>Account Actions</h2>
            <button className={`${styles.button} ${styles.logoutButton}`} onClick={logout}>
              <FaSignOutAlt /> Logout
            </button>
            <button className={`${styles.button} ${styles.deleteButton}`} onClick={handleDeleteAccount}>
              <FaTrash /> Delete Account
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;