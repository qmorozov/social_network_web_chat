import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react';
import Loader from '../../../../component/loader/Loader';
import { useService } from '../../../../hooks/useService';
import { Account } from '../../../account/account.service';
import { VacancieProvider } from '../../../vacancie/vacancie.service';

import Style from './ResumeDescription.module.scss';

const ResumeDescription: FC = () => {
  const Resume = useService(Account);
  const Vacancy = useService(VacancieProvider);
  const [resume, setResume] = useState<any>();
  const { query } = useRouter();
  useEffect(() => {
    const getResumeFromAPI = async () => {
      await Resume.getResume(query?.accountId as string).then((res) => {
        setResume(res);
      });
    };
    const getJobFromAPI = async () => {
      await Vacancy.getJob(query?.vacancyId).then((res) => {
        setResume(res);
      });
    };
    if (query?.vacancyId) {
      getJobFromAPI();
    }
    if (query?.accountId) {
      getResumeFromAPI();
    }
  }, []);

  if (!resume) {
    return <Loader />;
  }
  return (
    <div className={Style.Resume}>
      <div className={Style.ResumeTitle}>
        {resume?.title},{resume?.currency?.symbol}
        {resume?.salaryFrom} - {resume?.salaryTo}
      </div>
      <div className={Style.Address}>{resume?.address}</div>
      <div className={Style.Description}>{resume?.description}</div>
    </div>
  );
};

export default ResumeDescription;
