import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import UserProfileDropdown from './UserProfileDropdown';

const ProfileAvatar = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="profile-avatar-container" ref={dropdownRef}>
      <button 
        className="avatar-button" 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-label="User menu"
      >
        {user?.image ? (
          <Image
            src={user.image}
            alt="User avatar"
            width={40}
            height={40}
            className="avatar-image"
          />
        ) : (
          <div className="avatar-placeholder">
            {user?.name?.charAt(0) || 'U'}
          </div>
        )}
      </button>
      <UserProfileDropdown 
        isOpen={isDropdownOpen} 
        onClose={() => setIsDropdownOpen(false)} 
      />
    </div>
  );
};

export default ProfileAvatar;