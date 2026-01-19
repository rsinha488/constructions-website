import { NextResponse } from 'next/server';

export function successResponse(data: any, status = 200) {
    return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 400) {
    return NextResponse.json({ success: false, error: message }, { status });
}

export function unauthorizedResponse() {
    return errorResponse('Unauthorized', 401);
}

export function forbiddenResponse() {
    return errorResponse('Forbidden', 403);
}

export function notFoundResponse(message = 'Resource not found') {
    return errorResponse(message, 404);
}
