'use client';

import { useState, useEffect } from 'react';
import questionService from '@/src/services/questionService';
import { Question, SelectedQuestionData, INewQuestion } from '@/src/types/question';
import SpinningLoading from '@/src/components/ui/loading/spinningLoading';
import { Pagination } from '@/src/types/pagination';
import { Language } from '@/src/types/language';
import Alert from '@/src/components/ui/notification/alert';
import { IAlert } from '@/src/types/alert';
import { handleApiError } from '@/src/utils/handleApi';

const QuestionPage = () => {
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState<Language>('en');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isEditText, setIsEditText] = useState(false);
    const [isEditAnswer, setIsEditAnswer] = useState(false);
    const [isAddQuestion, setIsAddQuestion] = useState(false);
    const [keySearch, setKeySearch] = useState('');
    const [isAlert, setIsAlert] = useState<IAlert>({
        type: 'success',
        message: ''
    });
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        perPage: 20,
        total: 0,
        totalPages: 0
    });
    const [selectedData, setSelectedData] = useState<SelectedQuestionData>({
        qIndex: -1,
        aIndex: -1,
        value: ''
    });
    const newQuestionFirstData = {
        en: {
            id: 0,
            question: '',
            answers: [''],
            correct_answer: 0,
            selected_answer: null,
            explanation: 'Updating'
        },
        vi: {
            id: 0,
            question: '',
            answers: [''],
            correct_answer: 0,
            selected_answer: null,
            explanation: 'Đang cập nhật'
        }
    };
    const [newQuestion, setNewQuestion] = useState<INewQuestion>(newQuestionFirstData);

    useEffect(() => {
        setLoading(true);
        getQuestions();
    }, [language, pagination.page, pagination.perPage, keySearch]);

    const setPageData = (data: any) => {
        setPagination({
            page: data.current_page,
            perPage: data.per_page,
            total: data.total,
            totalPages: data.total_pages
        });

        setQuestions(data.list);
    }

    const getQuestions = async () => {
        try {
            const params: { page: number; per_page: number; language: Language; key?: string } = {
                page: pagination.page,
                per_page: pagination.perPage,
                language: language
            };

            if (keySearch) {
                params.key = keySearch;
            }

            const response = await questionService.getQuestions(params);
            setPageData(response.data);
        } catch (error: any) {
            setIsAlert({
                type: 'error',
                message: handleApiError(error.response)
            });
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
        setIsAddQuestion(false);

        if (isEditText) {
            setIsEditText(false);
            setSelectedData({
                qIndex: -1,
                aIndex: -1,
                value: ''
            });
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
        setIsAddQuestion(false);

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

    const selectDataType = (e: any, qIndex: number, aIndex: number, value: string) => {
        e.preventDefault();

        if (isEditText) {
            setSelectedData({
                qIndex: qIndex,
                aIndex: aIndex,
                value: formatText(value, true)
            });
        }

        if (isEditAnswer && aIndex !== -1 && aIndex !== -2 && aIndex !== questions[qIndex].correct_answer) {
            updateAnswer(qIndex, aIndex);
        }
    }

    const updateAnswer = async (qIndex: number, aIndex: number) => {
        setLoading(true);

        try {
            const response = await questionService.updateAnswer(questions[qIndex].id, {
                answer_id: aIndex,
                language: language,
                page: pagination.page,
                per_page: pagination.perPage,
            });
            setPageData(response.data);
            setIsAlert({
                type: 'success',
                message: 'Update answer successfully!'
            });
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

    const updateText = async () => {
        try {
            setLoading(true);
            const response = await questionService.updateQuestionText(questions[selectedData.qIndex].id, {
                answer_id: selectedData.aIndex,
                value: formatText(selectedData.value),
                language: language,
                page: pagination.page,
                per_page: pagination.perPage,
            });

            setPageData(response.data);
            setSelectedData({
                qIndex: -1,
                aIndex: -1,
                value: ''
            });
            setIsAlert({
                type: 'success',
                message: 'Update text successfully!'
            });
        } catch (error: any) {
            setIsAlert({
                type: 'error',
                message: handleApiError(error.response)
            });
        } finally {
            setLoading(false);
        }
    }

    const convertLanguage = (e: any, lang: 'en' | 'vi') => {
        e.preventDefault();

        if (selectedData.qIndex !== -1) {
            alert('Please update the data before changing the language');
        } else {
            setLanguage(lang);
        }
    }

    const filterPage = (e: any) => {
        const page = Number(e.target.value);

        if (!isNaN(page) && page > 0 && page <= pagination.totalPages) {
            setPagination({ ...pagination, page });
        }
    }

    const searchText = (e: any) => {
        if (e.key === 'Enter') {
            setKeySearch(e.target.value);
            setPagination({
                ...pagination,
                page: 1
            });
        }
    }

    const setLimit = (e: any) => {
        setPagination({
            ...pagination,
            page: 1,
            perPage: Number(e.target.value)
        });
    }

    const deleteQuestion = async (e: any, id: number) => {
        setLoading(true);

        try {
            const response = await questionService.deleteQuestion(id, {
                page: pagination.page,
                per_page: pagination.perPage,
            });

            setPageData(response.data);
            setIsAlert({
                type: 'success',
                message: 'Delete question successfully!'
            });
        } catch (error: any) {
            setIsAlert({
                type: 'error',
                message: handleApiError(error.response)
            });
        } finally {
            setLoading(false);
        }
    }

    const openNewQuestionForm = () => {
        setIsAddQuestion(!isAddQuestion);

        if (isEditText) {
            setIsEditText(false);
            setSelectedData({
                qIndex: -1,
                aIndex: -1,
                value: ''
            });
        }

        if (isEditAnswer) {
            setIsEditAnswer(false);
        }

        if (!isAddQuestion) {
            setNewQuestion(newQuestionFirstData);
        }
    }

    const addAnswer = (e: any) => {
        e.preventDefault();

        setNewQuestion({
            ...newQuestion,
            en: {
                ...newQuestion.en,
                answers: [...newQuestion.en.answers, '']
            },
            vi: {
                ...newQuestion.vi,
                answers: [...newQuestion.vi.answers, '']
            }
        });
    }

    const removeAnswer = (e: any, index: number) => {
        e.preventDefault();

        setNewQuestion({
            ...newQuestion,
            en: {
                ...newQuestion.en,
                answers: newQuestion.en.answers.filter((_, i) => i !== index)
            },
            vi: {
                ...newQuestion.vi,
                answers: newQuestion.vi.answers.filter((_, i) => i !== index)
            }
        });
    }

    const formatNewQuestion = (question: INewQuestion) => {
        const formatText = (text: string) => text.split('\n').map(line => line.trim()).join('<br/>');

        return {
            en: {
                ...question.en,
                question: formatText(question.en.question),
                answers: question.en.answers.map(formatText),
                explanation: formatText(question.en.explanation)
            },
            vi: {
                ...question.vi,
                question: question.vi.question || formatText(question.en.question),
                answers: question.vi.answers.map((answer, index) => answer || formatText(question.en.answers[index])),
                explanation: question.vi.explanation || formatText(question.en.explanation)
            }
        };
    };

    const addQuestion = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formattedQuestion = formatNewQuestion(newQuestion);
            const response = await questionService.addQuestion(formattedQuestion);
            setPageData(response.data);
            setIsAlert({
                type: 'success',
                message: 'Add question successfully!'
            });
            setNewQuestion({
                en: {
                    id: 0,
                    question: '',
                    answers: [''],
                    correct_answer: 0,
                    selected_answer: null,
                    explanation: ''
                },
                vi: {
                    id: 0,
                    question: '',
                    answers: [''],
                    correct_answer: 0,
                    selected_answer: null,
                    explanation: ''
                }
            });
            setIsAddQuestion(false);
        } catch (error: any) {
            setIsAlert({
                type: 'error',
                message: handleApiError(error.response)
            });
        } finally {
            setLoading(false);
        }
    }

    const uploadQuestions = async (e: any) => {
        e.preventDefault();
        if (confirm('Are you sure you want to upload the questions?')) {
            setLoading(true);

            try {
                await questionService.uploadQuestions();
            } catch (error: any) {
                setIsAlert({
                    type: 'error',
                    message: handleApiError(error.response)
                });
            } finally {
                setLoading(false);
            }
        }
    }

    const downloadQuestions = async (e: any) => {
        e.preventDefault();

        if (confirm('Are you sure you want to download the questions?')) {
            setLoading(true);

            try {
                const response = await questionService.downloadQuestions();
                const links = response.data;

                links.forEach((link: string) => console.log(link));
            } catch (error: any) {
                setIsAlert({
                    type: 'error',
                    message: handleApiError(error.response)
                });
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <div className='wrapper'>
            {loading && <SpinningLoading />}
            <Alert type={isAlert.type} message={isAlert.message} />
            <div className="filter sticky">
                <div className="actions">
                    <button className='btn btn-sm btn-default mr-2' onClick={(e) => convertLanguage(e, language === 'en' ? 'vi' : 'en')}>
                        {language === 'en' ? 'EN' : 'VI'}
                    </button>

                    <button className={`mobile-text btn btn-sm btn-${isAddQuestion ? 'danger' : 'primary'} mr-2`} onClick={() => openNewQuestionForm()}>
                        {isAddQuestion ? 'Cancel create new question' : 'Create new question'}
                    </button>

                    <button className={`mobile-text btn btn-sm btn-${isEditAnswer ? 'danger' : 'primary'} mr-2`} onClick={() => editAnswer()}>
                        {isEditAnswer ? 'Cancel edit answer' : 'Editing Answer'}
                    </button>

                    <button className={`mobile-text btn btn-sm btn-${isEditText ? 'danger' : 'primary'} mr-2`} onClick={() => editText()}>
                        {isEditText ? 'Cancel edit text' : 'Editing Text'}
                    </button>

                    <button className="mobile-text btn btn-sm btn-warning mr-2" onClick={(e) => uploadQuestions(e)}>
                        Upload questions
                    </button>

                    <button className="mobile-text btn btn-sm btn-warning mr-2" onClick={(e) => downloadQuestions(e)}>
                        Download questions
                    </button>
                </div>

                <div className="pagination">
                    <span className="mobile-text btn-sm">
                        Limit
                    </span>
                    <select className='btn btn-default' value={pagination.perPage} onChange={(e) => setLimit(e)}>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    <button className={`btn btn-sm btn-default ${pagination.page === 1 ? 'disabled' : ''}`} onClick={() => prevPage()}>
                        {"<"}
                    </button>
                    <div className='page-input'>
                        <span className="mobile-text">Page</span> <input type="text" onChange={(e) => filterPage(e)} value={pagination.page} /> / {pagination.totalPages}
                    </div>
                    <button className={`btn btn-sm btn-default ${pagination.page === pagination.totalPages ? 'disabled' : ''}`} onClick={() => nextPage()}>
                        {">"}
                    </button>
                    <div className="search">
                        <input type="text" placeholder='Key search ...' onKeyDown={(e) => searchText(e)} />
                    </div>
                </div>
            </div>

            {!loading && !isAddQuestion && questions.length === 0 && (
                <div className='no-data'>
                    No data available.
                </div>
            )}

            {isAddQuestion && (
                <div className="question-container">
                    <strong>Question:</strong>
                    <div className="question flex">
                        <textarea
                            placeholder="EN"
                            value={newQuestion.en.question}
                            onChange={(e) => setNewQuestion({
                                ...newQuestion,
                                en: { ...newQuestion.en, question: e.target.value }
                            })}
                            cols={30}
                        />
                        <textarea
                            placeholder="VI"
                            value={newQuestion.vi.question}
                            onChange={(e) => setNewQuestion({
                                ...newQuestion,
                                vi: { ...newQuestion.vi, question: e.target.value }
                            })}
                        />
                    </div>
                    <div className="answers">
                        <strong>Answers: </strong>
                        <ul className="answers-list">
                            {newQuestion.en.answers.map((answer, index) => (
                                <div key={index} className='flex items-center'>
                                    <a href="#" className='btn btn-danger cursor-pointer mr-2' onClick={(e) => { removeAnswer(e, index) }}>
                                        -
                                    </a>
                                    <input
                                        type="radio"
                                        checked={newQuestion.en.correct_answer === index}
                                        onChange={() => setNewQuestion({
                                            ...newQuestion,
                                            en: { ...newQuestion.en, correct_answer: index },
                                            vi: { ...newQuestion.vi, correct_answer: index }
                                        })}
                                        className='mr-2 cursor-pointer'
                                    />
                                    <textarea
                                        placeholder="EN"
                                        value={answer}
                                        onChange={(e) => setNewQuestion({
                                            ...newQuestion,
                                            en: {
                                                ...newQuestion.en,
                                                answers: newQuestion.en.answers.map((ans, i) => i === index ? e.target.value : ans)
                                            }
                                        })}
                                    />
                                    <textarea
                                        placeholder="VI"
                                        value={newQuestion.vi.answers[index] || ''}
                                        onChange={(e) => setNewQuestion({
                                            ...newQuestion,
                                            vi: {
                                                ...newQuestion.vi,
                                                answers: newQuestion.vi.answers.map((ans, i) => i === index ? e.target.value : ans)
                                            }
                                        })}
                                    />
                                </div>
                            ))}
                        </ul>
                        <a className='btn btn-primary cursor-pointer' onClick={(e) => addAnswer(e)}>
                            +
                        </a>
                    </div>
                    <strong>Explanation:</strong>
                    <div className="explanation flex">
                        <textarea
                            placeholder="EN"
                            value={newQuestion.en.explanation}
                            onChange={(e) => setNewQuestion({
                                ...newQuestion,
                                en: { ...newQuestion.en, explanation: e.target.value }
                            })}
                        />
                        <textarea
                            placeholder="VI"
                            value={newQuestion.vi.explanation}
                            onChange={(e) => setNewQuestion({
                                ...newQuestion,
                                vi: { ...newQuestion.vi, explanation: e.target.value }
                            })}
                        />
                    </div>
                    <button onClick={(e) => addQuestion(e)} className='btn btn-primary'>
                        Create
                    </button>
                </div>
            )}

            {questions.map((q, qIndex) => (
                <div key={q.id} className='question-container'>
                    <button
                        className='btn btn-danger btn-sm float-right mobile-text'
                        onClick={(e) => {
                            if (confirm('Are you sure you want to delete this question?')) {
                                deleteQuestion(e, q.id);
                            }
                        }}
                    >
                        Delete
                    </button>
                    <div className='question'>
                        <div
                            className='cursor-pointer'
                            onClick={(e) => selectDataType(e, qIndex, -1, q.question)}
                            style={{
                                display: selectedData.qIndex === qIndex && selectedData.aIndex === -1 ? 'none' : 'block'
                            }}
                        >
                            <strong>Question {q.id}: </strong>
                            <div className='question-name ml-2' dangerouslySetInnerHTML={{ __html: q.question }} />
                        </div>
                        {selectedData.qIndex === qIndex && selectedData.aIndex === -1 && (
                            <textarea
                                value={selectedData.value}
                                onChange={(e) => setSelectedData({ ...selectedData, value: e.target.value })}
                                placeholder="Type your answer here"
                            />
                        )}
                    </div>
                    <div className='answers ml-2'>
                        <ul className='answers-list'>
                            {q.answers.map((answer, aIndex) => (
                                <div key={aIndex}>
                                    {selectedData.qIndex === qIndex && selectedData.aIndex === aIndex ? (
                                        <textarea
                                            value={selectedData.value}
                                            onChange={(e) =>
                                                setSelectedData({ ...selectedData, value: e.target.value })
                                            }
                                            placeholder="Type your answer here"
                                        />
                                    ) : (
                                        <div
                                            className='cursor-pointer'
                                            onClick={(e) => selectDataType(e, qIndex, aIndex, answer)}
                                        >
                                            <li
                                                className={`answer-item ${aIndex === q.correct_answer
                                                    ? 'correct'
                                                    : aIndex === q.selected_answer
                                                        ? 'selected'
                                                        : ''
                                                    }`}
                                                style={{
                                                    color:
                                                        aIndex === q.correct_answer
                                                            ? 'red'
                                                            : aIndex === q.selected_answer
                                                                ? 'orange'
                                                                : 'inherit',
                                                    fontWeight:
                                                        aIndex === q.correct_answer || aIndex === q.selected_answer
                                                            ? 'bold'
                                                            : 'normal'
                                                }}
                                            >
                                                {aIndex + 1}. <span dangerouslySetInnerHTML={{ __html: answer }} />
                                            </li>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </ul>
                    </div>
                    <div className='explanation ml-2'>
                        <strong>Explanation:</strong>
                        <div
                            className='cursor-pointer'
                            onClick={(e) => selectDataType(e, qIndex, -2, q.explanation)}
                            style={{
                                display:
                                    selectedData.qIndex === qIndex && selectedData.aIndex === -2 ? 'none' : 'block'
                            }}
                            dangerouslySetInnerHTML={{ __html: q.explanation }}
                        />
                        {selectedData.qIndex === qIndex && selectedData.aIndex === -2 && (
                            <textarea
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
