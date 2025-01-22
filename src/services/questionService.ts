import ApiClient from './apiClient';

const apiClient = new ApiClient();

const getQuestions = async (language: string): Promise<any[]> => {
    try {
        return await apiClient.get<any[]>('', { language });
    } catch (error) {
        console.error('Error fetching questions:', error);
        throw error;
    }
};

const updateAnswer = async (request: any): Promise<any[]> => {
    try {
        return await apiClient.post<any[]>('update-answer', request);
    } catch (error) {
        console.error('Error update answer:', error);
        throw error;
    }
};

const questionService = {
    getQuestions,
    updateAnswer
};

export default questionService;
