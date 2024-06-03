import cors from 'cors-anywhere';

const host = '0.0.0.0';
const port = 8080;

cors.createServer({
    originWhitelist: [],
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, () => {
    console.log(`server running on port: ${port}`)
});