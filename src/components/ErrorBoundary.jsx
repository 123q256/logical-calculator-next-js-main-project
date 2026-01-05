"use client";

import React from 'react';
import { logger } from '../utils/logger';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        logger.error(
            'ErrorBoundary caught an error',
            error,
            { componentStack: errorInfo.componentStack }
        );
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="p-6 m-4 bg-red-50 border border-red-200 rounded-lg text-center">
                    <h2 className="text-xl font-bold text-red-800 mb-2">Something went wrong</h2>
                    <p className="text-red-600 mb-4">We've logged this issue and are working on a fix.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
