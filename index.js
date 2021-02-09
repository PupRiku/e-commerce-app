const express = require('express');
const app = express();

const { PORT } = require('./config');

async function startServer() {
    app.listen(PORT, () => {
        console.log(`Server listening on PORT ${PORT}`);
    })
}

startServer();