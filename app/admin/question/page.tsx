'use client';

import { useState, useEffect } from 'react';
import questionService from '@/src/services/questionService';
import { Question, SelectedQuestionData } from '@/src/types/question';
import SpinningLoading from '@/src/components/ui/loading/spinningLoading';

const QuestionPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [language, setLanguage] = useState<'en' | 'vi'>('en');
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 1,
        total: 0,
        totalPages: 0
    });
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedData, setSelectedData] = useState<SelectedQuestionData>({
        qIndex: -1,
        aIndex: -1,
        value: ''
    });
    const [isEditText, setIsEditText] = useState(false);
    const [isEditAnswer, setIsEditAnswer] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError(null);
        getQuestions();
    }, [language, pagination.page]);

    const setPageData = (response: any) => {
        setPagination({
            page: response.current_page,
            perPage: response.per_page,
            total: response.total,
            totalPages: response.total_pages
        });

        setQuestions(response.data);
    }

    const getQuestions = async () => {
        try {
            const response = await questionService.getQuestions({
                page: pagination.page,
                per_page: pagination.perPage,
                language: language
            });

            setPageData(response);
        } catch (error) {
            console.error('Error fetching questions:', error);
            setError('Failed to fetch questions. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    const prevPage = () => {
        if (pagination.page > 1) {
            setPagination({
                ...pagination,
                page: pagination.page - 1
            })
        }
    }

    const nextPage = () => {
        if (pagination.page < pagination.totalPages) {
            setPagination({
                ...pagination,
                page: pagination.page + 1
            })
        }
    }

    const editAnswer = () => {
        setIsEditAnswer(!isEditAnswer);

        if (isEditText) {
            setIsEditText(false);
        }
    }

    const editText = () => {
        if (isEditText) {
            setSelectedData({
                qIndex: -1,
                aIndex: -1,
                value: ''
            });
        }

        setIsEditText(!isEditText);

        if (isEditAnswer) {
            setIsEditAnswer(false);
        }
    }

    const cancelData = () => {
        setSelectedData({
            qIndex: -1,
            aIndex: -1,
            value: ''
        });
    }

    const selectDataType = (event: React.MouseEvent, qIndex: number, aIndex: number, value: string) => {
        event.preventDefault();

        if (isEditText) {
            setSelectedData({
                qIndex: qIndex,
                aIndex: aIndex,
                value: value
            });
        }

        if (isEditAnswer && aIndex !== -1 && aIndex !== -2 && aIndex !== questions[qIndex].correctAnswer) {
            updateAnswer(qIndex, aIndex);
        }
    }

    const updateAnswer = async (qIndex: number, aIndex: number) => {
        setLoading(true);

        try {
            const response = await questionService.updateAnswer({
                question_id: questions[qIndex].id,
                answer_id: aIndex,
                language: language,
                page: pagination.page,
                per_page: pagination.perPage,
            });
            setPageData(response);
        } catch (error) {
            console.error('Error update answer:', error);
            setError('Failed to update answer. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    const updateText = async () => {
        try {
            setLoading(true);
            const response = await questionService.updateText({
                question_id: questions[selectedData.qIndex].id,
                answer_id: selectedData.aIndex,
                value: selectedData.value,
                language: language,
                page: pagination.page,
                per_page: pagination.perPage,
            });

            setPageData(response);
            setSelectedData({
                qIndex: -1,
                aIndex: -1,
                value: ''
            });
        } catch (error) {
            console.error('Error update text:', error);
            setError('Failed to update text. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    const convertLanguage = (event: React.MouseEvent, lang: 'en' | 'vi') => {
        event.preventDefault();

        if (selectedData.qIndex !== -1) {
            alert('Please update the data before changing the language');
        } else {
            setLanguage(lang);
        }
    }

    if (loading) return <SpinningLoading />
    if (error) return <div>{error}</div>

    return (
        <div className='wrapper'>
            <h1 className='title'>Questions</h1>
            <div className="filter sticky">
                <div className="actions">
                    <button
                        className='btn btn-default mr-2'
                        onClick={(e) => convertLanguage(e, language === 'en' ? 'vi' : 'en')}
                    >
                        Convert to {language === 'en' ? 'VI' : 'EN'}
                    </button>

                    <button
                        onClick={() => editAnswer()}
                        className={`btn btn-${isEditAnswer ? 'danger' : 'primary'} mr-2`}
                    >
                        {isEditAnswer ? 'Stop edit answer' : 'Edit answer'}
                    </button>

                    <button
                        onClick={() => editText()}
                        className={`btn btn-${isEditText ? 'danger' : 'primary'} mr-2`}
                    >
                        {isEditText ? 'Stop edit text' : 'Edit text'}
                    </button>
                </div>

                <div className="pagination">
                    <button
                        className={`btn btn-default ${pagination.page === 1 ? 'disabled' : ''}`}
                        onClick={() => prevPage()}
                    >
                        {"<"}
                    </button>
                    <div className='page-input'>
                        Page <input type="text" value={pagination.page} onChange={(e) => {
                            const page = Number(e.target.value);
                            if (!isNaN(page) && page > 0 && page <= pagination.totalPages) {
                                setPagination({ ...pagination, page });
                            }
                        }} /> of {pagination.totalPages}
                    </div>
                    <button
                        className={`btn btn-default ${pagination.page === pagination.totalPages ? 'disabled' : ''}`}
                        onClick={() => nextPage()}
                    >
                        {">"}
                    </button>
                </div>
            </div>

            {questions.map((q, qIndex) => (
                <div key={q.id} className='question-container'>
                    <button
                        className='btn btn-danger btn-sm float-right'
                    // onClick={() => {
                    //     const updatedQuestions = questions.filter((_, index) => index !== qIndex);
                    //     setQuestions(updatedQuestions);
                    // }}
                    >
                        Delete
                    </button>
                    <div className='question'>
                        <a
                            className='cursor-pointer'
                            onClick={(e) => selectDataType(e, qIndex, -1, q.question)}
                            style={{
                                display: selectedData.qIndex === qIndex && selectedData.aIndex === -1 ? 'none' : 'block'
                            }}
                        >
                            <strong>Question {q.id}:</strong> {q.question}
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
                                            className='cursor-pointer'
                                            onClick={(e) => selectDataType(e, qIndex, aIndex, answer)}
                                        >
                                            <li
                                                className={`answer-item ${aIndex === q.correctAnswer
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
                            <button onClick={updateText} className='btn btn-primary'>
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
