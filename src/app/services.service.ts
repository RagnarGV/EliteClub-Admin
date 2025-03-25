import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable } from 'rxjs';
import apiClient from './axios-config';
import { HttpClient } from '@angular/common/http';
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
  is_live: boolean;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  //private apiUrl = 'https://eliteclub-api.onrender.com/api';

  private newApiUrl = 'https://clubelite.ca/apis';
  //private apiUrl = 'http://localhost:3000/api';
  constructor(private http: HttpClient) {}

  async register(data: any): Promise<any> {
    try {
      const response = await axios.post(this.newApiUrl + '/register', data);
      return response.data;
    } catch (error: any) {
      throw error.response ? error.response.data : error;
    }
  }
  async login(data: any): Promise<any> {
    try {
      const response = await apiClient.post(this.newApiUrl + '/login', data);
      if (response.data.csrf_token) {
        localStorage.setItem('token', response.data.csrf_token);
        localStorage.setItem('name', response.data.user.name);
      }
      return response.data;
    } catch (error: any) {
      throw error.response ? error.response.data : error;
    }
  }
  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!window.localStorage.getItem('token');
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('token');
  }
  getSchedule(): Observable<any> {
    return this.http.get<any>(this.newApiUrl + '/schedule');
  }

  // getSchedule(): Observable<any> {
  //   return new Observable<any>((observer) => {
  //     const fetchData = () => {
  //       this.http.get<any>(this.newApiUrl + '/schedule').subscribe(
  //         (data) => observer.next(data), // Emit the fetched data
  //         (error) => observer.error(error) // Handle errors
  //       );
  //     };

  //     fetchData(); // Fetch immediately
  //     const intervalId = setInterval(fetchData, 5000); // Fetch every 5 seconds

  //     return () => clearInterval(intervalId); // Cleanup on unsubscribe
  //   });
  // }

  async getGames() {
    const response = await axios.get(`${this.newApiUrl}/schedule/games`);
    return response.data;
  }

  async getScheduleById(id: string) {
    const response = await axios.get(`${this.newApiUrl}/schedule/${id}`);
    return response.data;
  }

  async updateSchedule(id: string, schedule: any) {
    const response = await axios.post(
      `${this.newApiUrl}/schedule/update/${id}`,
      schedule
    );
    return response.data;
  }
  async addSchedule(schedule: any) {
    const response = await axios.post(this.newApiUrl + '/schedule', schedule);
    return response.data;
  }
  async deleteSchedule(id: string) {
    await axios.post(`${this.newApiUrl}/schedule/delete/${id}`);
  }
  async addGalleryItem(data: FormData) {
    const response = await axios.post(this.newApiUrl + '/gallery', data);
    return response.data;
  }

  async getGallery() {
    const response = await axios.get(this.newApiUrl + '/gallery');
    return response.data;
  }

  async deleteGalleryItem(id: string) {
    await axios.post(`${this.newApiUrl}/gallery/delete/${id}`);
  }

  async updateGalleryItem(id: string, updatedData: any) {
    await apiClient.post(`${this.newApiUrl}/gallery/update/${id}`, updatedData);
  }

  async getWaitlist() {
    const response = await axios.get(this.newApiUrl + '/waitlist');
    return response.data;
  }

  async addToWaitlist(data: any) {
    try {
      const response = await axios.post(`${this.newApiUrl}/waitlist`, data);
      return response.data;
    } catch (error: any) {
      if (error.status === 400) {
        alert('Phone number already exists');
      }
    }
  }
  async updateToWaitlist(id: string, updatedData: any) {
    try {
      const response = await axios.post(
        `${this.newApiUrl}/waitlist/update/${id}`,
        updatedData
      );
      return response.data;
    } catch (error: any) {
      if (error.status === 400) {
        alert('Phone number already exists');
      }
    }
  }
  async deleteWaitlist(id: string) {
    await axios.post(`${this.newApiUrl}/waitlist/delete/${id}`);
  }
  async checkInWaitlist(id: string) {
    await axios.post(`${this.newApiUrl}/waitlist/checkin/${id}`);
  }
  async getToc(id: any) {
    const response = await axios.get(this.newApiUrl + '/toc/' + id);
    return response.data;
  }
  async addToToc(data: any) {
    try {
      const response = await axios.post(`${this.newApiUrl}/toc`, data);
      return response.data;
    } catch (error: any) {
      if (error.status === 400) {
        alert('Phone number already exists');
      }
    }
  }
  async updateToToc(id: string, updatedData: any) {
    try {
      const response = await axios.post(
        `${this.newApiUrl}/toc/update/${id}`,
        updatedData
      );
      return response.data;
    } catch (error: any) {
      if (error.status === 400) {
        alert('Phone number already exists');
      }
    }
  }
  async deleteToc(id: string) {
    await axios.post(`${this.newApiUrl}/toc/delete/${id}`);
  }
  async checkInToc(id: string) {
    await axios.post(`${this.newApiUrl}/toc/checkin/${id}`);
  }

  async setTocStatus(id: string) {
    await axios.post(`${this.newApiUrl}/toc-settings/status/${id}`);
  }

  async getTocSettings() {
    const response = await axios.get(this.newApiUrl + '/toc-settings');
    return response.data;
  }

  async AddTocSettings(updatedData: any) {
    try {
      const response = await axios.post(
        `${this.newApiUrl}/toc-settings`,
        updatedData
      );
      return response.data;
    } catch (error: any) {
      if (error.status === 400) {
        console.log(error);
      }
    }
  }

  async updateTocSettings(id: string, updatedData: any) {
    try {
      const response = await axios.post(
        `${this.newApiUrl}/toc-settings/update/${id}`,
        updatedData
      );
      return response.data;
    } catch (error: any) {
      if (error.status === 400) {
        alert('Phone number already exists');
      }
    }
  }
  async deleteTocSettings(id: string) {
    await axios.post(`${this.newApiUrl}/toc-settings/delete/${id}`);
  }

  async getAllGames() {
    const response = await axios.get(`${this.newApiUrl}/game`);
    return response.data;
  }

  async addGame(game: any) {
    const response = await axios.post(`${this.newApiUrl}/game`, game);
    return response.data;
  }

  async updateGame(id: string, game: any) {
    const response = await axios.post(
      `${this.newApiUrl}/game/update/${id}`,
      game
    );
    return response.data;
  }

  async deleteGame(id: string) {
    await axios.post(`${this.newApiUrl}/game/delete/${id}`);
  }

  // Review CRUD operations
  async getAllReviews() {
    const response = await axios.get(`${this.newApiUrl}/reviews`);
    return response.data;
  }

  async addReview(review: any) {
    const response = await axios.post(`${this.newApiUrl}/reviews`, review);
    return response.data;
  }

  async updateReview(id: string, review: any) {
    const response = await axios.post(
      `${this.newApiUrl}/reviews/update/${id}`,
      review
    );
    return response.data;
  }

  async deleteReview(id: string) {
    await axios.post(`${this.newApiUrl}/reviews/delete/${id}`);
  }

  //Endpoints for the special events
  async getAllEvents(): Promise<any> {
    try {
      const response = await axios.get(`${this.newApiUrl}/special-events`);

      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  // Add new event
  async addEvent(eventData: any): Promise<any> {
    try {
      const response = await axios.post(
        `${this.newApiUrl}/special-events`,
        eventData
      );
      return response.data;
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  }

  // Update event
  async updateEvent(id: string, eventData: any): Promise<any> {
    try {
      const response = await axios.post(
        `${this.newApiUrl}/special-events/update/${id}`,
        eventData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  // Delete event
  async deleteEvent(id: string): Promise<any> {
    try {
      await axios.post(`${this.newApiUrl}/special-events/delete/${id}`);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }
}
