export type SpiderStatus =
  | 'IDLE'
  | 'SEARCHING'
  | 'WALKING'
  | 'SCANNING'
  | 'EXTRACTING'
  | 'COLLECTING'
  | 'PROCESSING'
  | 'ERROR'
  | 'COMPLETE';

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  rank: number;
  wordCount?: number;
  publishedDate?: string;
  domain: string;
}

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  domain: string;
  sourceName?: string;
  snippet: string;
  category: string;
  timeAgo: string;
  author?: string;
  score?: number;
}

export interface ChunkItem {
  id: string;
  source_id: string;
  source_title: string;
  source_url: string;
  text: string;
  token_count: number;
  heading: string;
  position: number;
  relevance: number;
  dom_selector?: string;
  vector?: number[];
  entities?: string[];
}

export interface EntityItem {
  id: string;
  name: string;
  type: 'CONCEPT' | 'PERSON' | 'ORGANIZATION' | 'LOCATION' | 'TOPIC' | 'METHODOLOGY';
  source_ids: string[];
  mentions: number;
  relevance: number;
}

export interface RelationshipItem {
  id: string;
  source: string;
  target: string;
  type: 'CONTAINS' | 'MENTIONS' | 'RELATED_TO' | 'REFERENCES' | 'BELONGS_TO';
  weight: number;
}

export interface SourceItem {
  id: string;
  sessionId: string;
  url: string;
  title: string;
  domain: string;
  captured_at: string;
  wordCount: number;
  chunksCount: number;
  entitiesCount: number;
  rawContent?: string;
  extractedHtml?: string;
  quality: {
    overall: number;
    content: number;
    structure: number;
    metadata: number;
    noise: number;
  };
  headings: string[];
  links: string[];
  metadata: {
    author?: string;
    publishedDate?: string;
    canonicalUrl?: string;
    description?: string;
  };
}

export interface SpiderEvent {
  id: string;
  type:
    | 'SEARCH_STARTED'
    | 'SEARCH_RESULT'
    | 'PAGE_OPENED'
    | 'PAGE_SCANNING'
    | 'DOM_DETECTED'
    | 'TEXT_EXTRACTED'
    | 'LINK_DISCOVERED'
    | 'CHUNK_CREATED'
    | 'EMBEDDING_CREATED'
    | 'ENTITY_FOUND'
    | 'RELATIONSHIP_FOUND'
    | 'SOURCE_CONNECTED'
    | 'CRAWL_STARTED'
    | 'CRAWL_FINISHED'
    | 'CRAWL_PAUSED'
    | 'ERROR'
    | 'SYSTEM_METRIC'
    | 'CONNECTED';
  sessionId: string;
  timestamp: number;
  data: any;
}

export interface ResearchSession {
  id: string;
  query: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  sources: SourceItem[];
  chunks: ChunkItem[];
  entities: EntityItem[];
  relationships: RelationshipItem[];
  events: SpiderEvent[];
  crawlDepth: number;
  maxPages: number;
}

export interface CrawlSettings {
  maxDepth: number;
  maxPages: number;
  allowedDomains: string[];
  blockedDomains: string[];
  delayMs: number;
  respectRobotsTxt: boolean;
  extractImages: boolean;
  extractLinks: boolean;
  generateEmbeddings: boolean;
  buildGraph: boolean;
}

export interface Particle {
  id: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  label?: string;
  color?: string;
  progress: number;
}
