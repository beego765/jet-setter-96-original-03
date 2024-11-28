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
  if (response.errors && response.errors.length > 0) {
    const error = response.errors[0];
    throw new DuffelApiException(
      `Duffel API Error: ${error.message}`,
      response.errors,
      response.meta?.status
    );
  }

  if (!response.data) {
    throw new DuffelApiException('No data received from Duffel API');
  }

  return response.data;
};