import ApiClient from './apiClient';
import Cookies from 'js-cookie';

const adminPrefix = 'admin/questions';
const apiClient = new ApiClient();
const token = Cookies.get('admin_token');
apiClient.setHeader('Authorization', `Bearer ${token}`);

const getQuestions = async (request: any): Promise<any> => {
    return await apiClient.get<any[]>(adminPrefix, request);
};

const addQuestion = async (request: any): Promise<any> => {
    return await apiClient.post<any[]>(adminPrefix, request);
};

const deleteQuestion = async (id: number, request: any): Promise<any> => {
    return await apiClient.delete<any[]>(adminPrefix + '/' + id, request);
};

const updateAnswer = async (id: number, request: any): Promise<any> => {
    return await apiClient.put<any[]>(adminPrefix + '/' + id + '/update-answer', request);
};

const updateQuestionText = async (id: number, request: any): Promise<any> => {
    return await apiClient.put<any[]>(adminPrefix + '/' + id + '/update-question-text', request);
};

const questionService = {
    getQuestions,
    addQuestion,
    deleteQuestion,
    updateAnswer,
    updateQuestionText,
};

export default questionService;
