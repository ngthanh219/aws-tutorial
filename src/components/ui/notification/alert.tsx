import { IAlert } from '@/src/types/alert';
import React from 'react';

const Alert: React.FC<IAlert> = ({ type, message }) => {
    return message !== '' ? (
        <div className={`alert ${type === 'success' ? 'alert-success' : 'alert-danger'}`}>
            {message}
        </div>
    ) : null;
};

export default Alert;
