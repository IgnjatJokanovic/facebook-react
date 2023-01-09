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
            <div>{alertObj.message}</div>
        </div>
    ) : (
        <div
            className={
                alertObj.state === "success"
                    ? "alert alert--success"
                    : "alert alert--danger"
            }
        >
            <div>{alertObj.message}</div>
        </div>
    )
}
