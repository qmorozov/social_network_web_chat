import React from 'react';
import { CompanyDTO } from './dto/company';
import { CompanyHeader } from './components/company-header/CompanyHeader';
import CompanyInfo from './components/company-info/CompanyInfo';
import Style from './Company.module.scss';

interface ICompany {
  company: CompanyDTO;
  clickLike: () => void;
}

const Company = ({ company, clickLike }: ICompany) => {
  // const [members, setMembers] = useState<any>([]);

  // useEffect(() => {
  //   const getMembersFromAPI = async () => {
  //     await BusinessApi.getCompanyMembers(company.id).then((res) => {
  //       setMembers(res);
  //     });
  //   };
  //   getMembersFromAPI();
  // }, []);

  return (
    <div className={Style.Wrapper}>
      <CompanyHeader company={company} />
      <CompanyInfo company={company} clickLike={clickLike} />
    </div>
  );
};

export default Company;
