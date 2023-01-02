import React from 'react'

export default function Alert({ alertObj }) {
    return alertObj.message != null ? (
        <div
            className={
                alertObj.state === "success"
                    ? "alert alert--visible alert--success"
                    : "alert alert--visible alert--danger"
            }
        >
            <p>{alertObj.message}</p>
        </div>
    ) : (
        <div
            className={
                alertObj.state === "success"
                    ? "alert alert--success"
                    : "alert alert--danger"
            }
        >
            <p>{alertObj.message}</p>
        </div>
    )
}
