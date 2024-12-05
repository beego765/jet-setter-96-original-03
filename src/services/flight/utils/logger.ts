export const logError = (context: string, error: any, additionalInfo?: any) => {
  console.error(`[${context}] Error:`, {
    message: error.message,
    stack: error.stack,
    additionalInfo: additionalInfo || {}
  });
};

export const logDebug = (context: string, message: string, data?: any) => {
  console.debug(`[${context}] ${message}`, data || '');
};