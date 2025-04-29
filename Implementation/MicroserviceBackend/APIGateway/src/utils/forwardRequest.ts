import express from 'express';
import axios from 'axios';

const forwardRequest = async (req: express.Request, res: express.Response, targetUrl: string) => {
  try {
   
    const method = req.method.toLowerCase();
    let cookieHeader = req.headers.cookie || '';

    // ✅ If we have a refreshed accessToken, update the Cookie header manually
    // if (res.locals.accessToken) {
    //   const cookies = cookieHeader
    //     .split(';')
    //     .map(cookie => cookie.trim())
    //     .filter(cookie => !cookie.startsWith('accessToken=')); // Remove old accessToken if exists

    //   // Add the new accessToken
    //   cookies.push(`accessToken=${res.locals.accessToken}`);

    //   cookieHeader = cookies.join('; ');
    // }

    const axiosConfig = {
      method: method,
      url: targetUrl,
      data: req.body,
      headers: {
        Cookie: cookieHeader, // ✅ Use the updated Cookie header
        'Content-Type': 'application/json',
      },
      params: req.query,
      withCredentials: true,
    };

    const response = await axios(axiosConfig);
    console.log(response);
    // Copy response headers (including Set-Cookie if needed)
    Object.entries(response.headers).forEach(([key, value]) => {
      if (key.toLowerCase() !== 'content-encoding') {
        res.setHeader(key, value);
      }
    });

    res.status(response.status).send(response.data);

  } catch (error: any) {
    console.log(error.message);
    console.error('Error forwarding request:', error.message);

    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send({ message: 'Gateway error forwarding request' });
    }
  }
};

export default forwardRequest;
