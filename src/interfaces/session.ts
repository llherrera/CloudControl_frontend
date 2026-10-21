export interface Session {
  SessionId: number;
  UserId: number;
  username: string;
  email: string;
  StartedAtUtc: string;
  EndedAtUtc?: string;
  IsActive: boolean;
  DeviceSummary?: string;
  BrowserName?: string;
  OsName?: string;
  ApproxLocation?: string;
  IpTruncatedOrHash?: string;
  TabsCountMax?: number;
  ReconnectCount?: number;
  DurationSeconds?: number;
  id_plan?: number;
}

export interface CreateSessionPayload {
  userId: number | string;
  deviceSummary?: string;
  browserName?: string;
  osName?: string;
  approxLocation?: string;
  ipTruncatedOrHash?: string;
}

export interface UpdateSessionActivityPayload {
  sessionId: number | string;
  tabsCount?: number;
  incrementReconnect?: boolean;
}

export interface CreateSessionEventPayload {
  sessionId: number | string;
  userId: number | string;
  eventType: string;
  eventName?: string;
  eventMetadata?: string; // JSON.stringify(...)
  deviceSummary?: string;
  approxLocation?: string;
}

export interface UserSessionEvent {
  EventId: number;
  SessionId: number;
  UserId: number;
  EventTimeUtc: string;
  EventType: string;
  EventName?: string;
  EventMetadata?: string;
  DeviceSummary?: string;
  ApproxLocation?: string;
}

export interface User {
  id_user: number;
  name: string;
  lastname: string;
  password: string;
  username: string;
  email: string;
  rol: string;
  id_plan: number;
}

export interface UserSessionAlert {
  AlertId: number;
  UserId: number;
  SessionId?: number;
  AlertTimeUtc: string;
  AlertType: string;
  SeverityLevel: string;
  Description: string;
  Resolved: boolean;
  ResolvedAtUtc?: string;
  CreatedAtUtc: string;
}
