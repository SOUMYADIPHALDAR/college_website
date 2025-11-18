class apiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        error = null,
        stack
    ) {
        super(message)
        this.name = this.constructor.name
        this.statusCode = statusCode
        this.error = error
        this.message = message
        this.data = null
        this.success = false
        Error.captureStackTrace(this, this.constructor)

    }
}

export { apiError };