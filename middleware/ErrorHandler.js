// Define error-handling middleware
const ErrorHandler = (err, req, res, next) => {
    // Duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({ error: 'Duplicate key error' });
    }

    // Handle Mongoose validation errors (ValidationError)
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(error => error.message);
        return res.status(400).json({ error: errors.join(', ') });
    }

    // Handle Mongoose cast errors (CastError)
    if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid value for field' });
    }

    // Handle Mongoose bulk write errors (BulkWriteError)
    if (err.name === 'BulkWriteError') {
        return res.status(500).json({ error: 'Bulk write error' });
    }

    // Handle common Node.js errors
    switch (err.name) {
        case 'SyntaxError':
            return res.status(400).json({ error: 'Syntax error' });
        case 'ReferenceError':
            return res.status(500).json({ error: 'Reference error' });
        case 'TypeError':
            return res.status(400).json({ error: 'Type error' });
        case 'RangeError':
            return res.status(400).json({ error: 'Range error' });
        case 'InternalError':
            return res.status(500).json({ error: 'Internal error' });
        case 'Error':
            return res.status(500).json({ error: 'General error' });
        case 'SystemError':
            return res.status(500).json({ error: 'System error' });
        case 'PromiseRejectionWarning':
            return res.status(500).json({ error: 'Promise rejection warning' });
        case 'UnhandledPromiseRejectionWarning':
            return res.status(500).json({ error: 'Unhandled promise rejection warning' });
        case 'TimeoutError':
            return res.status(500).json({ error: 'Timeout error' });
        default:
            return res.status(500).json({ error: 'Unknown error' });
    }
};

// Export the error-handling middleware
export default ErrorHandler;
