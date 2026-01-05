"use client";

import { useEffect, useState } from 'react';
import { logger } from '../utils/logger';
import { FaBug, FaTrash, FaDownload, FaTimes } from 'react-icons/fa';

export default function LogViewer() {
    const [isOpen, setIsOpen] = useState(false);
    const [logs, setLogs] = useState([]);
    const [isDev, setIsDev] = useState(false);

    useEffect(() => {
        setIsDev(process.env.NODE_ENV === 'development');
        setLogs(logger.getLogs());

        const handleNewLog = () => setLogs(logger.getLogs());
        const handleLogsCleared = () => setLogs([]);

        window.addEventListener('new-error-log', handleNewLog);
        window.addEventListener('logs-cleared', handleLogsCleared);

        return () => {
            window.removeEventListener('new-error-log', handleNewLog);
            window.removeEventListener('logs-cleared', handleLogsCleared);
        };
    }, []);

    // Only show in dev or if explicitly activated via URL param ?debug=true
    if (!isDev && typeof window !== 'undefined' && !window.location.search.includes('debug=true')) {
        return null;
    }

    const exportLogs = () => {
        const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `error-logs-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2"
                    title="View Error Logs"
                    aria-label="View Error Logs"
                >
                    <FaBug />
                    {logs.length > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                            {logs.length}
                        </span>
                    )}
                </button>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg shadow-xl w-[500px] h-[400px] flex flex-col">
                    <div className="p-3 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
                        <h3 className="font-bold text-sm flex items-center gap-2">
                            <FaBug className="text-gray-600" />
                            Error Logs ({logs.length})
                        </h3>
                        <div className="flex gap-2">
                            <button
                                onClick={exportLogs}
                                className="p-1.5 hover:bg-gray-200 rounded text-gray-600"
                                title="Export JSON"
                                aria-label="Export Logs"
                            >
                                <FaDownload size={14} />
                            </button>
                            <button
                                onClick={() => logger.clearLogs()}
                                className="p-1.5 hover:bg-red-100 rounded text-red-600"
                                title="Clear Logs"
                                aria-label="Clear Logs"
                            >
                                <FaTrash size={14} />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 hover:bg-gray-200 rounded text-gray-500"
                                aria-label="Close Log Viewer"
                            >
                                <FaTimes size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-2 bg-gray-50 font-mono text-xs">
                        {logs.length === 0 ? (
                            <div className="text-center text-gray-400 mt-10">No logs recorded</div>
                        ) : (
                            logs.map((log) => (
                                <div key={log.id} className="mb-2 p-2 bg-white rounded border border-gray-100 shadow-sm">
                                    <div className="flex justify-between text-gray-400 mb-1">
                                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                                        <span className={`uppercase font-bold ${log.level === 'error' ? 'text-red-500' :
                                            log.level === 'warn' ? 'text-yellow-500' : 'text-blue-500'
                                            }`}>{log.level}</span>
                                    </div>
                                    <div className="font-medium break-words text-gray-800">{log.message}</div>
                                    {log.error && (
                                        <div className="mt-1 p-1 bg-red-50 text-red-700 rounded overflow-x-auto">
                                            {log.error.message}
                                        </div>
                                    )}
                                    {log.url && (
                                        <div className="mt-1 text-gray-400 truncate text-[10px]">{log.url}</div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )
            }
        </div >
    );
}
