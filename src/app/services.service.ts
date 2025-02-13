import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable } from 'rxjs';

export interface Game {
  type: string;
  limit: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface Schedule {
  id: string;
  day: string;
  time: string;
  games: Game[];
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  private apiUrl = 'https://eliteclub-api.onrender.com/api';

  constructor() {}

  async getSchedule(): Promise<Schedule[]> {
    const response = await axios.get<Schedule[]>(this.apiUrl + '/schedule');
    return response.data;
  }

  async getGames(): Promise<Game[]> {
    const response = await axios.get<Game[]>(`${this.apiUrl}/schedule/games`);
    return response.data;
  }

  async getScheduleById(id: string): Promise<Schedule> {
    const response = await axios.get<Schedule>(`${this.apiUrl}/schedule/${id}`);
    return response.data;
  }

  async updateSchedule(
    id: string,
    schedule: Partial<Schedule>
  ): Promise<Schedule> {
    const response = await axios.put<Schedule>(
      `${this.apiUrl}/schedule/${id}`,
      schedule
    );
    return response.data;
  }
  async addSchedule(schedule: Partial<Schedule>): Promise<Schedule> {
    const response = await axios.post<Schedule>(
      this.apiUrl + '/schedule',
      schedule
    );
    return response.data;
  }
  async deleteSchedule(id: string): Promise<void> {
    await axios.delete(`${this.apiUrl}/schedule/${id}`);
  }
  async addGalleryItem(data: FormData): Promise<Observable<any>> {
    const response = await axios.post(this.apiUrl + '/gallery', data);
    return response.data;
  }

  async getGallery(): Promise<GalleryItem[]> {
    const response = await axios.get<GalleryItem[]>(this.apiUrl + '/gallery');
    return response.data;
  }

  async deleteGalleryItem(id: string): Promise<void> {
    await axios.delete(`${this.apiUrl}/gallery/${id}`);
  }

  async updateGalleryItem(id: string, updatedData: any): Promise<void> {
    await axios.put(`${this.apiUrl}/gallery/${id}`, updatedData);
  }

  async fetchWaitlist() {
    const response = await axios.get(this.apiUrl + '/waitlist');
    return response.data;
  }

  async addToWaitlist(data: any): Promise<any> {
    const response = await axios.post(`${this.apiUrl}/waitlist`, data);
    return response.data;
  }
}
