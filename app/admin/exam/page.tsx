'use client';

import SpinningLoading from '@/src/components/ui/loading/spinningLoading';
import Alert from '@/src/components/ui/notification/alert';
import examService from '@/src/services/examService';
import { IAlert } from '@/src/types/alert';
import { IExam } from '@/src/types/exam';
import { INewQuestion, Question } from '@/src/types/question';
import { handleApiError } from '@/src/utils/handleApi';
import React, { useState, useEffect } from 'react';

const ExamPage = () => {
    const [titlePage, setTitlePage] = useState('...');
    const [btnText, setBtnText] = useState('Start');
    const [loading, setLoading] = useState(true);
    const [multiQuestion, setMultiQuestion] = useState<INewQuestion>();
    const [question, setQuestion] = useState<Question>();
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [correctAnswer, setCorrectAnswer] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number[]>([]);
    const [isSubmitAnswer, setIsSubmitAnswer] = useState(false);
    const [isAlert, setIsAlert] = useState<IAlert>({
        type: 'success',
        message: ''
    });
    const [examData, setExamData] = useState<IExam>({
        totalQuestions: 0,
        examQuestions: 0
    });

    useEffect(() => {
        setCorrectAnswer(false);
        getExamSS1();
    }, []);

    const getExamSS1 = async () => {
        try {
            const response = await examService.getExamSS1();

            if (response.data.exam_questions == 0) {
                setTitlePage(response.data.total_questions + ' questions');
            }

            setExamData({
                totalQuestions: response.data.total_questions,
                examQuestions: response.data.exam_questions
            });

            setMultiQuestion(response.data.question);
            setQuestion(response.data.question.en);
        } catch (error: any) {
            setIsAlert({
                type: 'error',
                message: handleApiError(error.response)
            });
        } finally {
            setLoading(false);
        }
    }

    const formatText = (text: string, reverse: boolean = false) => {
        if (!text) return '';
        if (reverse) {
            return text.split('<br/>').map(line => line.trim()).join('\n');
        }

        return text.split('\n').map(line => line.trim()).join('<br/>');
    };

    const startExam = () => {
        setExamData(prevData => ({
            ...prevData,
            examQuestions: 0.1
        }));
    }

    const convertLanguage = () => {
        if (currentLanguage === 'en') {
            setCurrentLanguage('vi');
            setQuestion(multiQuestion?.vi);
        } else {
            setCurrentLanguage('en');
            setQuestion(multiQuestion?.en);
        }
    }

    const selectAnswer = (e: any, index: number) => {
        if (!correctAnswer) {
            setSelectedAnswer(prevSelected =>
                prevSelected.includes(index)
                    ? prevSelected.filter(answer => answer !== index)
                    : [...prevSelected, index]
            );

            if (isSubmitAnswer) {
                setIsSubmitAnswer(false);
            }
        }
    }

    const checkAnswer = () => {
        if (selectedAnswer.length === 0) {
            setIsAlert({
                type: 'error',
                message: 'Please select an answer.'
            });
        } else {
            setIsSubmitAnswer(true);

            if (question?.correct_answer && selectedAnswer.length >= question.correct_answer.length) {
                const isCorrect = selectedAnswer.every(answer => question?.correct_answer.includes(answer));
                setCorrectAnswer(isCorrect);
            }
        }
    }

    const nextQuestion = async () => {
        setLoading(true);
        try {
            const response = await examService.ss1SubmitAnswer({
                question_id: question?.id
            });

            if (response.data.exam_questions == 0) {
                setTitlePage('Finished ' + response.data.total_questions + ' questions');
                setBtnText('Restart');
            }

            setSelectedAnswer([]);
            setIsSubmitAnswer(false);
            setCorrectAnswer(false);

            setExamData({
                totalQuestions: response.data.total_questions,
                examQuestions: response.data.exam_questions
            });

            setMultiQuestion(response.data.question);
            setQuestion(response.data.question.en);
        } catch (error: any) {
            setIsAlert({
                type: 'error',
                message: handleApiError(error.response)
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='wrapper wrapper-exam'>
            {loading && <SpinningLoading />}
            <Alert type={isAlert.type} message={isAlert.message} />

            {examData.examQuestions <= 0 ? (
                <div className="out-exam">
                    <p>{titlePage}</p>
                    <button className='btn btn-danger' onClick={startExam}>
                        {btnText}
                    </button>
                </div>
            ) : (
                <div className="question-wrapper">
                    <div className="wrapper-progress">
                        <div className="qs-progress">
                            <div className="progress-bar" style={{ width: `${examData.examQuestions / examData.totalQuestions * 100}%` }} />
                        </div>
                        <span>{examData.examQuestions < 1 ? 0 : examData.examQuestions} / {examData.totalQuestions} questions</span>
                    </div>
                    {selectedAnswer.length > 0 && correctAnswer && (
                        <div className="text-center mb-2">
                            <button className='btn btn-primary' onClick={nextQuestion}>Next</button>
                        </div>
                    )}
                    <button className='btn btn-outline-primary btn-sm float-right' onClick={convertLanguage}>
                        {currentLanguage === 'en' ? 'EN' : 'VI'}
                    </button>
                    <div className="question">
                        <div>
                            <strong onDoubleClick={convertLanguage}>Question: </strong>
                            <div className="question-name ml-2 mt-1">{formatText(question?.question || '', true)}</div>
                        </div>
                    </div>
                    <div className="answers ml-2 mt-2">
                        <ul className="answers-list">
                            <div>
                                <div className="cursor-pointer">
                                    {question?.answers.map((answer, index) => (
                                        <li key={index} className="answer-item">
                                            <a className={`cursor-pointer ${selectedAnswer.includes(index) ? 'bold text-success' : ''}`} onClick={(e) => selectAnswer(e, index)}>
                                                {index + 1}. <span>{formatText(answer, true)}</span>
                                            </a>
                                        </li>
                                    ))}
                                </div>
                            </div>
                        </ul>
                    </div>
                    {!correctAnswer && (
                        <div className="mb-2">
                            <button className='btn btn-primary' onClick={checkAnswer}>Submit</button>
                        </div>
                    )}
                    {isSubmitAnswer && (
                        <div className="correct-answer-wrapper">
                            <div className="correct-answer">
                                <strong>Correct answer: </strong>
                                {correctAnswer ? (
                                    <div className='ml-2 mt-1 alert-success'>
                                        {question?.correct_answer.map((ans, idx) => (
                                            <p key={idx}>{ans + 1}. {question?.answers[ans]}</p>
                                        ))}
                                    </div>
                                ) : (
                                    <p className='ml-2 mt-1 alert-danger'>Your answer is incorrect.</p>
                                )}
                            </div>
                            {correctAnswer && (
                                <div className="explanation mt-1">
                                    <strong>Explanation: </strong>
                                    <div dangerouslySetInnerHTML={{ __html: question?.explanation || '' }} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExamPage;
