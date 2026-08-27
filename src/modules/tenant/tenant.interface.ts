export interface CreateRentalRequestPayload {
  propertyId: string;
  startDate: string;
  endDate: string;
  message?: string;
  monthlyRent: number;
  totalAmount: number;
}
