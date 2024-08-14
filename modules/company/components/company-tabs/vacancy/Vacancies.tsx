import React from 'react';
import { useTypedSelector } from '../../../../../hooks/useTypedSelector';
import Resumes from '../../../../account/components/resumes/Resumes';

import Style from './Vacancies.module.scss';

const Vacancies = ({ companyId }: { companyId: string }) => {
  const { jobs } = useTypedSelector((state) => state.jobs);

  return jobs.map((job: any) => {
    return (
      <div key={job.id} className={Style.Vacancie}>
        <Resumes resume={job} companyId={companyId} />
      </div>
    );
  });
};

export default Vacancies;
