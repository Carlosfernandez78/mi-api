export const validate = (requiredFields) => (req, res, next) => {
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({ message: `Missing required field: ${field}` });
    }
  }
  next();
};
