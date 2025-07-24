// src/components/AuthModal.jsx
import React from 'react';
import LoginPage from './LoginPage.jsx';
import SignUpPage from './SignUpPage.jsx';

const AuthModal = ({ isOpen, onClose, mode }) => {
    if (!isOpen) return null;

    return (
        <dialog className="modal modal-open">
            <div className="modal-box w-11/12 max-w-2xl">
                <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                </button>
                {mode === 'login' ? <LoginPage /> : <SignUpPage />}
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </dialog>
    );
};

export default AuthModal;
