'use client';

import { useState, useEffect } from 'react';
import questionService from '@/src/services/questionService';
import { Question, SelectedQuestionData } from '@/src/types/question';

const QuestionPage = () => {
    const [language, setLanguage] = useState<'en' | 'vi'>('en');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedData, setSelectedData] = useState<SelectedQuestionData>({
        qIndex: -1,
        aIndex: -1,
        value: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await questionService.getQuestions(language);
                setQuestions(response);
            } catch (error) {
                console.error('Error fetching questions:', error);
                setError('Failed to fetch questions. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [language]);

    const convertLanguage = (event: React.MouseEvent, lang: 'en' | 'vi') => {
        event.preventDefault();

        if (selectedData.qIndex !== -1) {
            alert('Please update the data before changing the language');
        } else {
            setLanguage(lang);
        }
    };

    const selectDataType = (
        event: React.MouseEvent,
        qIndex: number,
        aIndex: number,
        value: string
    ) => {
        event.preventDefault();

        if (isEditing) {
            setSelectedData({
                qIndex: qIndex,
                aIndex: aIndex,
                value: value
            });
        } else {
            if (aIndex !== -1) {
                if (aIndex !== questions[qIndex].correctAnswer) {
                    const updatedQuestions = questions.map((question, index) => {
                        if (index === qIndex) {
                            return { ...question, correctAnswer: aIndex };
                        }
                        return question;
                    });
                    setQuestions(updatedQuestions);
                }
            }
        }
    };

    const updateData = () => {
        const updatedQuestions = questions.map((q, qIndex) => {
            if (qIndex === selectedData.qIndex) {
                if (selectedData.aIndex === -1) {
                    return { ...q, question: selectedData.value };
                } else if (selectedData.aIndex === -2) {
                    return { ...q, explanation: selectedData.value };
                } else if (selectedData.aIndex >= 0) {
                    const updatedAnswers = q.answers.map((answer, aIndex) =>
                        aIndex === selectedData.aIndex ? selectedData.value : answer
                    );
                    return { ...q, answers: updatedAnswers };
                }
            }
            return q;
        });

        setQuestions(updatedQuestions);

        setSelectedData({
            qIndex: -1,
            aIndex: -1,
            value: ''
        });
    };

    const cancelData = () => {
        setSelectedData({
            qIndex: -1,
            aIndex: -1,
            value: ''
        });
    };

    const edit = () => {
        if (isEditing) {
            setSelectedData({
                qIndex: -1,
                aIndex: -1,
                value: ''
            });
        }

        setIsEditing(!isEditing);
    };

    if (loading) return <div>Loading questions...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className='wrapper'>
            <h1 className='title'>Questions</h1>
            <a
                href="#"
                className='btn btn-default'
                onClick={(e) => convertLanguage(e, language === 'en' ? 'vi' : 'en')}
            >
                {language === 'en' ? 'VI' : 'EN'}
            </a>
            <button onClick={() => edit()} className='btn btn-primary'>
                {isEditing ? 'Stop Editing' : 'Edit'}
            </button>
            <br />
            <br />
            {questions.map((q, qIndex) => (
                <div key={q.id} className='question-container'>
                    <div className='question'>
                        <a
                            href="#"
                            onClick={(e) => selectDataType(e, qIndex, -1, q.question)}
                            style={{
                                display: selectedData.qIndex === qIndex && selectedData.aIndex === -1 ? 'none' : 'block'
                            }}
                        >
                            <strong>Question {qIndex + 1}:</strong> {q.question}
                        </a>
                        {selectedData.qIndex === qIndex && selectedData.aIndex === -1 && (
                            <input
                                type="text"
                                value={selectedData.value}
                                onChange={(e) => setSelectedData({ ...selectedData, value: e.target.value })}
                                placeholder="Type your answer here"
                            />
                        )}
                    </div>
                    <div className='answers'>
                        <ul className='answers-list'>
                            {q.answers.map((answer, aIndex) => (
                                <div key={aIndex}>
                                    {selectedData.qIndex === qIndex && selectedData.aIndex === aIndex ? (
                                        <input
                                            type="text"
                                            value={selectedData.value}
                                            onChange={(e) =>
                                                setSelectedData({ ...selectedData, value: e.target.value })
                                            }
                                            placeholder="Type your answer here"
                                        />
                                    ) : (
                                        <a
                                            href="#"
                                            onClick={(e) => selectDataType(e, qIndex, aIndex, answer)}
                                        >
                                            <li
                                                className={`answer-item ${
                                                    aIndex === q.correctAnswer
                                                        ? 'correct'
                                                        : aIndex === q.selectedAnswer
                                                        ? 'selected'
                                                        : ''
                                                }`}
                                                style={{
                                                    color:
                                                        aIndex === q.correctAnswer
                                                            ? 'red'
                                                            : aIndex === q.selectedAnswer
                                                            ? 'orange'
                                                            : 'inherit',
                                                    fontWeight:
                                                        aIndex === q.correctAnswer || aIndex === q.selectedAnswer
                                                            ? 'bold'
                                                            : 'normal'
                                                }}
                                            >
                                                {aIndex + 1}. {answer}
                                            </li>
                                        </a>
                                    )}
                                </div>
                            ))}
                        </ul>
                    </div>
                    <div className='explanation'>
                        <strong>Explanation:</strong>
                        <a
                            href="#"
                            onClick={(e) => selectDataType(e, qIndex, -2, q.explanation)}
                            style={{
                                display:
                                    selectedData.qIndex === qIndex && selectedData.aIndex === -2 ? 'none' : 'block'
                            }}
                        >
                            {q.explanation}
                        </a>
                        {selectedData.qIndex === qIndex && selectedData.aIndex === -2 && (
                            <input
                                type="text"
                                value={selectedData.value}
                                onChange={(e) =>
                                    setSelectedData({ ...selectedData, value: e.target.value })
                                }
                                placeholder="Type your explanation here"
                            />
                        )}
                    </div>
                    {selectedData.qIndex === qIndex ? (
                        <div>
                            <button onClick={updateData} className='btn btn-primary'>
                                Update
                            </button>
                            <button onClick={cancelData} className='btn btn-secondary'>
                                Cancel
                            </button>
                        </div>
                    ) : null}
                </div>
            ))}
        </div>
    );
};

export default QuestionPage;
