import React from 'react';

import { useAppSelector } from '@store/hooks';
import { User } from '@app/shared/models/user';

interface ProfileInfoProps {
  user: User;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  const loggedInUserId = useAppSelector((state) => state.auth.user?.id);

  return (
    <div className="profile-info">
      <img
        src={user.avatar}
        alt={user.displayName}
        className="profile-avatar"
      />
      <h2 className="profile-name">{user.displayName}</h2>
      <div className="profile-details">
        <p className="profile-detail">{user.fullName}</p>
        <p className="profile-detail">{user.dob}</p>
        <p className="profile-detail">{user.phone}</p>
        <p className="profile-detail">{user.email}</p>
      </div>

      {user.id === loggedInUserId && (
        <a className="edit-profile-link">Edit profile</a>
      )}
    </div>
  );
};

export default ProfileInfo;
