import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.isAxiosError) {
        console.error('Axios error:', {
            message: err.message,
            code: err.code,
            url: err.config?.url,
            status: err.response?.status,
            data: err.response?.data,
        });
    } else {
        console.error('Server error:', err.message);
    }

    const statusCode = err.response?.status || err.statusCode || 500;
    const message = err.response?.data.message || 'Internal Server Error';
    console.log(message);
    res.status(statusCode).json({
        success: false,
        message,
    });
};

export default errorHandler;
