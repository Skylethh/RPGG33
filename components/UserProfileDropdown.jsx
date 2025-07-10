import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react'; // Assuming you're using NextAuth
import Link from 'next/link';

const UserProfileDropdown = ({ isOpen, onClose }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  if (!isOpen) return null;

  return (
    <div className="profile-dropdown">
      <div className="dropdown-arrow"></div>
      <ul className="dropdown-menu">
        <li>
          <Link href="/profile">
            <a className="dropdown-item">Profile</a>
          </Link>
        </li>
        <li>
          <Link href="/settings">
            <a className="dropdown-item">Settings</a>
          </Link>
        </li>
        <li className="dropdown-divider"></li>
        <li>
          <button onClick={handleLogout} className="dropdown-item logout-btn">
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserProfileDropdown;