export default class HttpError extends Error {
    constructor(message, errorCode) {
        super(message)
        this.code = errorCode
        this.statusCode = errorCode // Add statusCode property for error middleware
    }
}