const express = require('express');
const app = express();

// Sample Route
app.get('/', (req, res) => {
    res.send('Backend is running');
});

app.listen(8080, () => {
    console.log('App is Listening on port 8080');
});
