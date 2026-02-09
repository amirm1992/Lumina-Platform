/**
 * Centralized API error handling utilities.
 * Provides consistent error responses across all API routes.
 */
import { NextResponse } from 'next/server'

export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500,
        public code?: string
    ) {
        super(message)
        this.name = 'ApiError'
    }
}

// Pre-defined error factories
export const Errors = {
    unauthorized: (message = 'Authentication required') =>
        new ApiError(message, 401, 'UNAUTHORIZED'),
    forbidden: (message = 'Access denied') =>
        new ApiError(message, 403, 'FORBIDDEN'),
    notFound: (resource = 'Resource') =>
        new ApiError(`${resource} not found`, 404, 'NOT_FOUND'),
    badRequest: (message: string) =>
        new ApiError(message, 400, 'BAD_REQUEST'),
    conflict: (message: string) =>
        new ApiError(message, 409, 'CONFLICT'),
    serviceUnavailable: (message = 'Service temporarily unavailable') =>
        new ApiError(message, 503, 'SERVICE_UNAVAILABLE'),
    internal: (message = 'Internal server error') =>
        new ApiError(message, 500, 'INTERNAL_ERROR'),
} as const

/**
 * Create a standardized JSON error response.
 */
export function errorResponse(error: ApiError | Error | unknown): NextResponse {
    if (error instanceof ApiError) {
        return NextResponse.json(
            { error: error.message, code: error.code },
            { status: error.statusCode }
        )
    }

    // Log unexpected errors server-side, return generic message to client
    console.error('Unhandled API error:', error)
    return NextResponse.json(
        { error: 'Internal server error', code: 'INTERNAL_ERROR' },
        { status: 500 }
    )
}

/**
 * Wrap an async API handler with consistent error handling.
 */
export function withErrorHandler(
    handler: (request: Request) => Promise<NextResponse>
): (request: Request) => Promise<NextResponse> {
    return async (request: Request) => {
        try {
            return await handler(request)
        } catch (error) {
            return errorResponse(error)
        }
    }
}
