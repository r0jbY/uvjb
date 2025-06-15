import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

const forwardRequest = async (req: Request, res: Response, next: NextFunction, targetUrl: string) => {
  const method = req.method.toLowerCase() as 'get' | 'post' | 'put' | 'delete';

  let cookies = req.headers.cookie || '';

  if (res.locals.accessToken) {
    cookies = cookies
      .split(';')
      .filter(c => !c.trim().startsWith('accessToken='))
      .concat(`accessToken=${res.locals.accessToken}`)
      .join('; ');
  }

  try {
    const response = await axios({
      method,
      url: targetUrl,
      data: req.body,
      headers: {
        ...req.headers,
        Cookie: cookies,
        'Content-Type': 'application/json',
      },
      params: req.query,
      withCredentials: true,
    });

    // Forward the headers
    for (const [key, value] of Object.entries(response.headers)) {
      if (key.toLowerCase() !== 'content-encoding') {
        res.setHeader(key, value as string);
      }
    }

    res.status(response.status).send(response.data);
  } catch (error: any) {
    next(error); // Forward to global error handler
  }
};

export default forwardRequest;
