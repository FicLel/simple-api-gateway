export const authMiddleware = (req, res, next) => {
  console.log(req.originalUrl);
  if (req.originalUrl === '/login' || req.originalUrl === '/signup') {
    next();
  } else {
    if (req.headers.authorization) {
      next();
    } else {
      res.status(401).send('Your are not authorized'); 
    }
  }
}
