import React, { FC, useEffect, useState } from 'react';
import Avatar from '../../../../component/avatar/Avatar';
import Loader from '../../../../component/loader/Loader';
import { BusinessApi } from '../../company.api';
import { IMember } from '../../dto/company';

type Team = {
  id: string;
};

const Team: FC<Team> = ({ id }: Team) => {
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function getMembers() {
      const data = await BusinessApi.getCompanyMembers(id);
      setMembers(data);
      setIsLoading(false);
    }
    getMembers();
  }, []);

  return isLoading ? (
    <Loader relative={true} />
  ) : (
    <ul>
      {members.map((member: IMember) => {
        const avatarOptions = {
          url: member?.user?.photoFileName,
          background: member?.user?.defaultAvatarBackground,
          isOnline: member?.user?.isOnline,
          name: member?.user?.name
        };
        return (
          <li key={member.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ height: '50px', width: '50px' }}>
              <Avatar options={avatarOptions} />
            </div>
            {member?.user?.name}
          </li>
        );
      })}
    </ul>
  );
};

export default Team;
