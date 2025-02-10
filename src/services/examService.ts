import ApiClient from './apiClient';
import Cookies from 'js-cookie';

const adminPrefix = 'admin/exams';
const apiClient = new ApiClient();
const token = Cookies.get('admin_token');
apiClient.setHeader('Authorization', `Bearer ${token}`);

const getExamSS1 = async (): Promise<any> => {
    return await apiClient.get<any[]>(adminPrefix + '/ss1', {});
};

const ss1SubmitAnswer = async (request: any): Promise<any> => {
    return await apiClient.post<any[]>(adminPrefix + '/ss1/submit-answer', request);
};

const examService = {
    getExamSS1,
    ss1SubmitAnswer
};

export default examService;
