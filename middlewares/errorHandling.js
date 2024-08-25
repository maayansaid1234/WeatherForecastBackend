export const errorHandling=(err, req, res, next) => {
    let statusCode = res.statusCode || 500;
    let message = err.message || "An error occurred";
    res.status(statusCode).send(message)
}