const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const { validateUserCredentials } = require('./utils/auth');
const { createReimbursement, updateReimbursementStatus } = require('./utils/reimbursement');

const app = express();
const PORT = 3001;
const SECRET = 'your_jwt_secret';

app.use(cors());
app.use(bodyParser.json());

const reimbursements = [];

function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      errorCode: 'AUTH001',
      errorType: 'Unauthorized',
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({
      errorCode: 'AUTH002',
      errorType: 'Unauthorized',
      message: 'Invalid token'
    });
  }
}

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = validateUserCredentials(username, password);

  if (!user) {
    return res.status(401).json({
      errorCode: 'AUTH003',
      errorType: 'InvalidCredentials',
      message: 'Invalid username or password'
    });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1h' });
  res.json({ token, role: user.role });
});

// Get reimbursements (with optional search)
app.get('/api/reimbursements', authenticate, (req, res) => {
  try {
    const search = req.query.search?.toLowerCase() || '';
    let filtered = reimbursements;

    if (req.user.role !== 'admin') {
      filtered = filtered.filter(r => r.userId === req.user.id);
    }

    if (search) {
      filtered = filtered.filter(r =>
        r.description?.toLowerCase().includes(search)
      );
    }

    return res.json(filtered);
  } catch (err) {
    return res.status(500).json({
      errorCode: 'SRV001',
      errorType: 'ServerError',
      message: 'Unable to fetch reimbursements'
    });
  }
});

// Create new reimbursement
app.post('/api/reimbursements', authenticate, (req, res) => {
  const result = createReimbursement(req.body, req.user.id);

  if (result.error) {
    const statusCode = result.error.errorType === 'ValidationError' ? 422 : 400;
    return res.status(statusCode).json(result.error);
  }

  reimbursements.push(result.reimbursement);
  return res.status(201).json(result.reimbursement);
});


// Update reimbursement status (admin only)
app.patch('/api/reimbursements/:id/status', authenticate, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const reimbursement = reimbursements.find(r => r.id === id);

  if (!reimbursement) {
    return res.status(404).json({
      errorCode: 'NOT_FOUND',
      errorType: 'ResourceNotFound',
      message: 'Reimbursement not found'
    });
  }

  const { status } = req.body;
  const result = updateReimbursementStatus(reimbursement, status, req.user.role);

  if (result.error) {
    const statusCode = result.error.errorType === 'ValidationError' ? 422 : 403;
    return res.status(statusCode).json(result.error);
  }

  return res.json(result.reimbursement);
});

// Pokreni server samo ako se fajl izvršava direktno
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Exportamo app za testove
module.exports = app;

