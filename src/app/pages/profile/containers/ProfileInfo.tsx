import React from 'react';
import defaultAvatar from '/imgs/avatar.jpg';

interface ProfileInfoProps {
  userId: number;
  loggedInUserId: number;
  picture?: string;
  displayName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  dob?: string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  userId,
  loggedInUserId,
  picture,
  displayName,
  email,
}) => {
  return (
    <div className="profile-info">
      <img
        src={picture || defaultAvatar}
        alt={displayName}
        className="profile-avatar"
      />
      <h2 className="profile-name">{displayName}</h2>
      <p className="profile-email">{email}</p>

      {userId === loggedInUserId && (
        <a className="edit-profile-link">Edit profile</a>
      )}
    </div>
  );
};

export default ProfileInfo;
