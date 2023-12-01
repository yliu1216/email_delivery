import {NextFunction, Request, Response} from 'express';

export default function CorsStar(req: Request, res: Response, next: NextFunction) {
  const allowedOrigins = ['http://localhost:3000', 'http://localhost:8081', 'http://localhost:19006', "*"];
  const origin = req.headers.origin as string;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    // Handle preflight requests
    res.sendStatus(200);
  } else {
    next();
  }
}
