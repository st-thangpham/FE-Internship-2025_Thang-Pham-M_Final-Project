import React from 'react';

import { User } from '@app/shared/models/user';

interface ProfileInfoProps {
  userProfile: User;
  isMyProfile: boolean;
  onEdit?: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  userProfile,
  isMyProfile,
  onEdit,
}) => {
  return (
    <div className="profile">
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

      {isMyProfile && (
        <a className="profile-edit" onClick={onEdit}>
          Edit profile
        </a>
      )}
    </div>
  );
};

export default ProfileInfo;
