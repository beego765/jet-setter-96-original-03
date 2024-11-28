import { DuffelApiError, DuffelApiResponse } from '../types/duffel';

export class DuffelApiException extends Error {
  constructor(
    message: string,
    public readonly errors?: DuffelApiError[],
    public readonly status?: number
  ) {
    super(message);
    this.name = 'DuffelApiException';
  }
}

export const handleDuffelApiResponse = (response: DuffelApiResponse) => {
  if (!response) {
    throw new DuffelApiException('No response received from Duffel API');
  }

  if (response.errors && response.errors.length > 0) {
    const error = response.errors[0];
    const errorMessage = error.message || 'Unknown Duffel API error';
    throw new DuffelApiException(
      `Duffel API Error: ${errorMessage}`,
      response.errors,
      response.meta?.status
    );
  }

  if (!response.data) {
    throw new DuffelApiException('Invalid response format from Duffel API');
  }

  return response.data;
};