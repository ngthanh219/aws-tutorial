'use client';
import adminMiddleware from '@/src/hooks/adminMiddleware';
import questionData from '@/public/list';
import { useState } from 'react';

const QuestionPage = () => {
    const questions = questionData;
    const [selectedData, setSelectedData] = useState({
        index: -1,
        value: ''
    });

    const selectDataType = (event: any, index: number, value: string) => {
        event.preventDefault();
        alert(`Selected ${index}: ${value}`);
        setSelectedData({
            index: index,
            value: value
        });
    }

    const updateData = () => {
        setSelectedData({
            index: -1,
            value: ''
        });
        alert('Update button clicked!');
    }

    return (
        <div style={containerStyle}>
            <h1 style={titleStyle}>Questions</h1>
            {questions.map((q, qIndex) => (
                <div key={q.id} style={questionContainerStyle}>
                    <div style={questionStyle}>
                        <a href="#" onClick={(e) => selectDataType(e, qIndex, q.question)}>
                            <strong>Question {qIndex + 1}:</strong> {q.question}
                        </a>
                    </div>
                    <div style={answersStyle}>
                        <ul style={ulStyle}>
                            {q.answers.map((answer, index) => (
                                <a href="#" key={index} onClick={(e) => selectDataType(e, index, answer)}>
                                    <li
                                        style={{
                                            ...liStyle,
                                            color: index === q.correctAnswer ? 'red' : index === q.selectedAnswer ? 'orange' : 'black',
                                            fontWeight: index === q.correctAnswer ? 'bold' : 'normal'
                                        }}
                                    >
                                        {index + 1}. {answer}
                                    </li>
                                </a>
                            ))}
                        </ul>
                    </div>
                    <div style={explanationStyle}>
                        <strong>Explanation:</strong> <a href="#" onClick={(e) => selectDataType(e, qIndex, q.explanation)}>{q.explanation}</a>
                    </div>
                    {
                        selectedData.index == qIndex ?
                            <button onClick={updateData} style={buttonStyle}>
                                Update
                            </button> : null
                    }
                </div>
            ))}
        </div>
    );
}

const containerStyle: React.CSSProperties = {
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
};

const titleStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '20px'
};

const questionContainerStyle: React.CSSProperties = {
    border: '1px solid #ddd',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9'
};

const questionStyle: React.CSSProperties = {
    marginBottom: '10px'
};

const answersStyle: React.CSSProperties = {
    marginBottom: '10px'
};

const explanationStyle: React.CSSProperties = {
    marginBottom: '10px'
};

const ulStyle: React.CSSProperties = {
    listStyleType: 'none',
    padding: 0,
    margin: 0
};

const liStyle: React.CSSProperties = {
    marginBottom: '4px'
};

const buttonStyle: React.CSSProperties = {
    padding: '5px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
};

export default adminMiddleware(QuestionPage);
