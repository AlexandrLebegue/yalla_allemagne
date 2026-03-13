import { NextResponse } from 'next/server';

/**
 * Health check endpoint for Docker and Cloud Run
 * Returns 200 OK if the application is running properly
 */
export async function GET() {
  try {
    // Basic health check - can be extended with database checks, etc.
    const healthcheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };

    return NextResponse.json(healthcheck, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}