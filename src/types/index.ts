
export interface ExtractedInfo {
  name: string;
  value: string | null;
}

export interface ExtractField {
  id: string;
  name: string;
}

export interface CompanyData {
  website: string;
  info: ExtractedInfo[];
  timestamp: number;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}
