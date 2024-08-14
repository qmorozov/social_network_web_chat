import { ApiGroup } from '../../types/api-group';
import { IAddCompanyState } from './store/add-company';

export const AddCompanyApi = new (class AuthApi extends ApiGroup {
  async CreateBusiness(data: any) {
    return this.post('/Business', data);
  }
})();
