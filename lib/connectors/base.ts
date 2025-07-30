export interface MetricUpdate {
  type: 'streaming' | 'social' | 'fanbase' | 'production';
  data: any;
  timestamp: Date;
}

export abstract class DataSourceConnector {
  protected apiKey?: string;
  protected apiSecret?: string;
  protected accessToken?: string;
  
  constructor(config?: Record<string, any>) {
    if (config) {
      this.apiKey = config.apiKey;
      this.apiSecret = config.apiSecret;
      this.accessToken = config.accessToken;
    }
  }

  abstract connect(): Promise<boolean>;
  abstract disconnect(): Promise<void>;
  abstract fetchMetrics(): Promise<MetricUpdate[]>;
  abstract getSourceType(): string;
  abstract isConnected(): boolean;
  
  protected async makeRequest(url: string, options?: RequestInit): Promise<any> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error in ${this.getSourceType()} connector:`, error);
      throw error;
    }
  }
}