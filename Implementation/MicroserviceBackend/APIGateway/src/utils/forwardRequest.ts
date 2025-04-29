import express from 'express';
import axios from 'axios';

const forwardRequest = async (req: express.Request, res: express.Response, targetUrl: string) => {
    try {
        const method = req.method.toLowerCase();

        const axiosConfig = {
            method: method as any,
            url: targetUrl,
            data: req.body,
            headers: {
                Cookie: req.headers.cookie || '',
            },
            params: req.query,
            withCredentials: true,
        };

        const response = await axios(axiosConfig);

        Object.entries(response.headers).forEach(([key, value]) => {
            if (key.toLowerCase() !== 'content-encoding') {
                res.setHeader(key, value);
            }
        });

        res.status(response.status).send(response.data);

    } catch (error: any) {
        console.error('Error forwarding request:', error.message);

        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send({ message: 'Gateway error forwarding request' });
        }
    }
};

export default forwardRequest;
