import React, { useState } from 'react';

export function AccordionLayout({ children }) {
    const [expand, setExpand] = useState(true);

    return (
        <div className='accordion accordion-flush' id='accordionFlushExample'>
            <div className='accordion-item'>
                <h2 className='accordion-header' id='flush-headingOne'>
                    <div
                        className='accordion-button-custom'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#flush-collapseOne'
                        aria-expanded='true'
                        aria-controls='flush-collapseOne'
                        onClick={() => expand ? setExpand(false) : setExpand(true)}
                    >
                        Table Creator Panel
                    </div>
                </h2>
                <div
                    id='flush-collapseOne'
                    className={expand ? 'accordion-collapse show' : 'accordion-collapse collapse'}
                    aria-labelledby='flush-headingOne'
                    data-bs-parent='#accordionFlushExample'
                >
                    <div className='accordion-body'>{children}</div>
                </div>
            </div>
        </div>
    )
}