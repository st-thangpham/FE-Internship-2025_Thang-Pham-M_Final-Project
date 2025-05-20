import React, { useContext } from 'react';

import { User } from '@app/shared/models/user';
import { AuthContext } from '@app/shared/contexts/auth.context';

interface ProfileInfoProps {
  userProfile: User;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ userProfile }) => {
  const { user } = useContext(AuthContext)!;

  return (
    <div className="profile-info">
      <img
        src={userProfile.avatar}
        alt={userProfile.displayName}
        className="profile-avatar"
      />
      <h2 className="profile-name">{userProfile.displayName}</h2>
      <div className="profile-details">
        <p className="profile-detail">{userProfile.fullName}</p>
        <p className="profile-detail">{userProfile.dob}</p>
        <p className="profile-detail">{userProfile.phone}</p>
        <p className="profile-detail">{userProfile.email}</p>
      </div>

      {user?.id === userProfile.id && (
        <a className="edit-profile-link">Edit profile</a>
      )}
    </div>
  );
};

export default ProfileInfo;
