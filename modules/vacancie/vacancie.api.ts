import { ApiGroup } from '../../types/api-group';

export const VacancieApi = new (class FeedApi extends ApiGroup {
  async postJob(businessId: string | null, data: any) {
    await this.post('Job', data, {
      params: { businessId }
    });
  }
  async putJob(jobId: string | string[] | undefined, data: any) {
    await this.put('Job', data, {
      params: { jobId }
    });
  }

  async getJobId(jobId: string | string[] | undefined) {
    return (
      await this.get('Job', {
        params: { jobId }
      })
    )?.data;
  }

  async getJobs(businessId: string, page = 1, pageSize = 50) {
    return (
      await this.get('Job/jobs', {
        params: { businessId, page, pageSize }
      })
    )?.data;
  }

  async deleteJob(jobId: string | string[] | undefined) {
    await this.delete('Job', {
      params: { jobId }
    });
  }
})();
