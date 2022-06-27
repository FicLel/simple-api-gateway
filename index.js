import express from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import cors from 'cors';
import parser from 'body-parser';
import {allMightyController} from './src/master-controller-user.js';
import {authMiddleware} from './src/auth-middleware.js';
  
const app = express();

app.use(parser.json())
app.use(parser.urlencoded({ extended: true }))
app.use(cors());
app.options('*', cors());
app.use(authMiddleware);

const API_SERVICE_URL = 'http://localhost:5001';

const simpleRequestLogger = (proxyServer, options) => {
  proxyServer.on('proxyReq', (proxyReq, req, res) => {
    console.log(`[HPM] [${req.method}] ${req.url}`); // outputs: [HPM] GET /users
  });
};


// SCHEDULE API endpoints
  app.use('/api', createProxyMiddleware({
    target: API_SERVICE_URL,
    ws: true,
    changeOrigin: true,
    plugins: [simpleRequestLogger],
    pathRewrite: {
      [`^/api`]: '',
      [`^/socket`]: ''
    },
    onProxyReq: fixRequestBody,
  }));

allMightyController(app);

  
const PORT = 5000;
  
app.listen(PORT,() => {
    console.log(`Running on PORT ${PORT}`);
})
