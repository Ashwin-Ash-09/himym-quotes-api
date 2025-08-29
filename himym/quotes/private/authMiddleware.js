import dotenv from 'dotenv';
dotenv.config();

/**
 * Middleware to authenticate private API requests using Bearer token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} 401 error if authentication fails, calls next() if successful
 */
export const authenticateApiKey = (req, res, next) => {
  // Get the authorization header
  const authHeader = req.headers.authorization;
  
  // Check if authorization header exists
  if (!authHeader) {
    return res.status(401).json({ 
      error: 'Unauthorized: No authorization header provided' 
    });
  }
  
  // Check if it's a Bearer token
  const tokenParts = authHeader.split(' ');
  if (tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
    return res.status(401).json({ 
      error: 'Unauthorized: Invalid authorization format. Use Bearer <api_key>' 
    });
  }
  
  // Get the API key from environment variables
  const apiKey = process.env.API_KEY;
  
  // Check if API key is configured
  if (!apiKey) {
    return res.status(500).json({ 
      error: 'Server configuration error: API key not found' 
    });
  }
  
  // Validate the token
  const token = tokenParts[1];
  if (token !== apiKey) {
    return res.status(401).json({ 
      error: 'Unauthorized: Invalid API key' 
    });
  }
  
  // If authentication is successful, proceed to the next middleware
  next();
};
