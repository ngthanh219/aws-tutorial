import ApiClient from './apiClient';
import Cookies from 'js-cookie';

const apiClient = new ApiClient();
const token = Cookies.get('admin_token');
apiClient.setHeader('Authorization', `Bearer ${token}`);

const getQuestions = async (request: any): Promise<any> => {
    return await apiClient.get<any[]>('', request);
};

const updateAnswer = async (request: any): Promise<any> => {
    return await apiClient.post<any[]>('update-answer', request);
};

const updateText = async (request: any): Promise<any> => {
    return await apiClient.post<any[]>('update-text', request);
};

const deleteQuestion = async (request: any): Promise<any> => {
    return await apiClient.post<any[]>('delete-question', request);
};

const addQuestion = async (request: any): Promise<any> => {
    return await apiClient.post<any[]>('add-question', request);
};

const questionService = {
    getQuestions,
    updateAnswer,
    updateText,
    deleteQuestion,
    addQuestion,
};

export default questionService;
