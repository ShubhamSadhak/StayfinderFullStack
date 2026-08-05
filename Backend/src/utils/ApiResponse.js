class ApiResponse{
    constructor(statusCode, data = null, message = "Success") {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400; // Consider status codes below 400 as success
    }
}

export {ApiResponse}