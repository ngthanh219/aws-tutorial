import ApiClient from './apiClient';

const apiClient = new ApiClient();

const getQuestions = async (language: string): Promise<any[]> => {
    try {
        const questions = await apiClient.get<any[]>('/', { language });

        return questions;
    } catch (error) {
        console.error('Error fetching questions:', error);

        throw error;
    }
};

const questionService = {
    getQuestions,
};

export default questionService;
