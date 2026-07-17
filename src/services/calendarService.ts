export interface MarketingEvent {
  id?: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  type: 'campaign' | 'content' | 'audit' | 'meeting';
  status: 'scheduled' | 'active' | 'completed';
  metadata?: any;
}

export class CalendarService {
  private static instance: CalendarService;
  private storageKey = 'flux_marketing_calendar';

  private constructor() {}

  static getInstance(): CalendarService {
    if (!CalendarService.instance) {
      CalendarService.instance = new CalendarService();
    }
    return CalendarService.instance;
  }

  private _getStoredEvents(): any[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private _saveStoredEvents(events: any[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(events));
  }

  async checkConflicts(start: Date, end: Date): Promise<boolean> {
    const events = await this.getEvents();
    return events.some(e => {
      const eStart = new Date(e.startTime).getTime();
      const eEnd = new Date(e.endTime).getTime();
      const targetStart = start.getTime();
      const targetEnd = end.getTime();
      
      return (targetStart >= eStart && targetStart < eEnd) || 
             (targetEnd > eStart && targetEnd <= eEnd);
    });
  }

  async createEvent(event: Omit<MarketingEvent, 'id'>): Promise<string> {
    const hasConflict = await this.checkConflicts(event.startTime, event.endTime);
    if (hasConflict) {
      throw new Error("Conflict Management Alert: A marketing block already exists for this timeframe.");
    }

    const events = this._getStoredEvents();
    const id = Math.random().toString(36).substring(7).toUpperCase();
    const newEvent = {
        ...event,
        id,
        startTime: event.startTime.toISOString(),
        endTime: event.endTime.toISOString(),
        createdAt: new Date().toISOString()
    };
    
    events.push(newEvent);
    this._saveStoredEvents(events);

    return id;
  }

  async getEvents(): Promise<MarketingEvent[]> {
    const events = this._getStoredEvents();
    return events.map(e => ({
      ...e,
      startTime: new Date(e.startTime),
      endTime: new Date(e.endTime)
    })) as MarketingEvent[];
  }
}
