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
  //private apiUrl = 'http://localhost:3000/api';
  constructor() {}
  async register(data: any): Promise<any> {
    try {
      const response = await axios.post(this.apiUrl + '/register', data);
      return response.data;
    } catch (error: any) {
      throw error.response ? error.response.data : error;
    }
  }
  async login(data: any): Promise<any> {
    try {
      const response = await axios.post(this.apiUrl + '/login', data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
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
  async getSchedule() {
    const response = await axios.get(this.apiUrl + '/schedule');
    return response.data;
  }

  async getGames() {
    const response = await axios.get(`${this.apiUrl}/schedule/games`);
    return response.data;
  }

  async getScheduleById(id: string) {
    const response = await axios.get(`${this.apiUrl}/schedule/${id}`);
    return response.data;
  }

  async updateSchedule(id: string, schedule: any) {
    const response = await axios.put(`${this.apiUrl}/schedule/${id}`, schedule);
    return response.data;
  }
  async addSchedule(schedule: any) {
    const response = await axios.post(this.apiUrl + '/schedule', schedule);
    return response.data;
  }
  async deleteSchedule(id: string) {
    await axios.delete(`${this.apiUrl}/schedule/${id}`);
  }
  async addGalleryItem(data: FormData) {
    const response = await axios.post(this.apiUrl + '/gallery', data);
    return response.data;
  }

  async getGallery() {
    const response = await axios.get(this.apiUrl + '/gallery');
    return response.data;
  }

  async deleteGalleryItem(id: string) {
    await axios.delete(`${this.apiUrl}/gallery/${id}`);
  }

  async updateGalleryItem(id: string, updatedData: any) {
    await axios.put(`${this.apiUrl}/gallery/${id}`, updatedData);
  }

  async getWaitlist() {
    const response = await axios.get(this.apiUrl + '/waitlist');
    return response.data;
  }

  async addToWaitlist(data: any) {
    const response = await axios.post(`${this.apiUrl}/waitlist`, data);
    return response.data;
  }
  async updateToWaitlist(id: string, updatedData: any) {
    await axios.put(`${this.apiUrl}/waitlist/${id}`, updatedData);
  }
  async deleteWaitlist(id: string) {
    await axios.delete(`${this.apiUrl}/waitlist/${id}`);
  }
  async checkInWaitlist(id: string) {
    await axios.put(`${this.apiUrl}/waitlist/checkin/${id}`);
  }

  async getAllGames() {
    const response = await axios.get(`${this.apiUrl}/game`);
    return response.data;
  }

  async addGame(game: any) {
    const response = await axios.post(`${this.apiUrl}/game`, game);
    return response.data;
  }

  async updateGame(id: string, game: any) {
    const response = await axios.put(`${this.apiUrl}/game/${id}`, game);
    return response.data;
  }

  async deleteGame(id: string) {
    await axios.delete(`${this.apiUrl}/game/${id}`);
  }

  // Review CRUD operations
  async getAllReviews() {
    const response = await axios.get(`${this.apiUrl}/reviews`);
    return response.data;
  }

  async addReview(review: any) {
    const response = await axios.post(`${this.apiUrl}/reviews`, review);
    return response.data;
  }

  async updateReview(id: string, review: any) {
    const response = await axios.put(`${this.apiUrl}/reviews/${id}`, review);
    return response.data;
  }

  async deleteReview(id: string) {
    const response = await axios.delete(`${this.apiUrl}/reviews/${id}`);
    return response.data;
  }
}
