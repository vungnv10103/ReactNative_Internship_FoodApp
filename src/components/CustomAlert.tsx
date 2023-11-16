import React, { useState } from 'react';

type CustomAlertProps = {
    open: boolean;
    title: string;
    message: string;
    onClose: () => void;
};

const CustomAlert: React.FC<CustomAlertProps> = ({ open, title, message, onClose }) => {
    if (!open) {
        return null; // Render nothing if the alert is closed
    }

    return (
        <div className="custom-alert-overlay">
            <div className="custom-alert">
                <h2>{title}</h2>
                <p>{message}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};
export default CustomAlert