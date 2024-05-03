// Error class doesn't have status by default
class HttpException extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

export default HttpException;