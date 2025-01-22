import React from 'react';
import '@/src/styles/spinningLoading.css';

const SpinningLoading: React.FC = () => {
    return (
        <div className='loading-wrap'>
            <span className="loader"></span>
        </div>
    );
};

export default SpinningLoading;
