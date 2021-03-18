import React from 'react';

export function Alert({ children }) {

    return (
        <div className='alert alert-warning' role='alert'>
            {children}
        </div>

    )
}