export type ExhibitMetadata = {
  size?: string;
  productionPeriod?: string;
  productionCompany?: string;
  materials?: string;
  colors?: string;
  weight?: string;
  suggestedCollection?: string;
  archivingMedium?: string;
  topic?: string;
  historicalContext?: string;
  name?: string;
  description?: string;
};

export type ExhibitItem = {
  id: string;
  name: string;
  description: string;
  images: string[];
  metadata: ExhibitMetadata;
  createdAt: string;
};

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};
