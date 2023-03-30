import app from './api/app.js';
import logger from './util/logger.js';

// The port to run the webapp backend server.
const port = 3000;

app.listen(port, () => {
    console.log(`Server is running at ${port}.`);
    logger.info(`Server is running at ${port}.`);
});

export default app;