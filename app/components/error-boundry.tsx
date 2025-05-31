import {
  isRouteErrorResponse,
  Meta,
  Links,
  Scripts,
  ScrollRestoration,
  useRouteError,
  Link,
} from "@remix-run/react";
import { AlertCircle, AlertTriangle, Home, RefreshCw } from "lucide-react";

export function ErrorBoundary() {
  const error = useRouteError();

  const errorStatus = isRouteErrorResponse(error) ? error.status : null;
  const errorMessage = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
    ? error.message
    : "An unknown error occurred";
  const errorDetails = isRouteErrorResponse(error) ? error.data : null;

  const ErrorIcon = errorStatus === 404 ? AlertCircle : AlertTriangle;

  return (
    <html lang="en">
      <head>
        <title>Error • Something went wrong</title>
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-4">
        <ScrollRestoration />

        <main className="w-full max-w-lg bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-red-50 p-6 flex items-center justify-center border-b border-red-100">
            <ErrorIcon size={48} className="text-red-500 mr-4" />
            <div>
              {errorStatus && (
                <span className="inline-block px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full mb-2">
                  Error {errorStatus}
                </span>
              )}
              <h1 className="text-2xl font-bold text-gray-900">
                Something went wrong
              </h1>
            </div>
          </div>

          <div className="p-6">
            <p className="text-gray-700 text-lg mb-4">{errorMessage}</p>

            {errorDetails && (
              <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-200">
                <h2 className="text-sm font-medium text-gray-500 mb-2">
                  Error details:
                </h2>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {errorDetails}
                </pre>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition font-medium"
              >
                <Home size={18} />
                Return Home
              </Link>

              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium"
              >
                <RefreshCw size={18} />
                Try Again
              </button>
            </div>
          </div>
        </main>

        <p className="mt-8 text-sm text-gray-500">
          If this problem persists, please contact support.
        </p>

        <Scripts />
      </body>
    </html>
  );
}
