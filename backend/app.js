const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'swagger.yaml'));

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is healthy' });
});

app.use(errorHandler);

module.exports = app;
