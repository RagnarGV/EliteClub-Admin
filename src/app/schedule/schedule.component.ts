import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ServicesService, Schedule, Game } from '../services.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
})
export class ScheduleComponent implements OnInit {
  allQuotes: any;
  resultdata: any;
  file: any;
  UpdateForm: FormGroup;
  selectedQuote: any;
  AddForm: FormGroup;
  title: any;
  progressbar: any;
  deleteId: any;
  updateId: any;
  downloadUrl: any;
  id: any;
  submitted: any;
  progress!: Observable<any>;
  quote: any;
  allEmojis: any;
  Emojis: any;
  mood: any;
  emotion: any;
  successMessage: any;
  schedule: Schedule[] = [];
  scheduleGames: Game[] = [];
  selectedSchedule: any;
  selectedLimits: number[] = []; // Track slider values
  viewSchedule: any;
  constructor(
    private services: ServicesService,
    public router: Router,

    private fb: FormBuilder
  ) {
    this.UpdateForm = this.fb.group({
      day: ['', Validators.required],
      time: ['', Validators.required],
      description: ['', Validators.required],
      games: this.fb.array([]),
    });
    this.AddForm = this.fb.group({
      day: ['', Validators.required],
      time: ['', Validators.required],
      description: ['', Validators.required],
      games: this.fb.array([]), // FormArray for games
    });
  }
  get games(): FormArray {
    return this.UpdateForm.get('games') as FormArray;
  }
  get addGames(): FormArray {
    return this.AddForm.get('games') as FormArray;
  }
  getGameFormGroup(index: number): FormGroup {
    return this.addGames.at(index) as FormGroup;
  }
  get fvaladd() {
    return this.AddForm.controls;
  }
  get fvalupdate() {
    return this.UpdateForm.controls;
  }

  ngOnInit(): void {
    this.getQuotes();
    this.getGames();
  }

  getQuotes() {
    this.services.getSchedule().then((data) => {
      this.schedule = data;
      console.log(this.schedule);
    });
  }
  getGames() {
    this.services.getGames().then((data) => {
      this.scheduleGames = data;
      console.log(this.scheduleGames);
    });
  }

  addGame(): void {
    const gameGroup = this.fb.group({
      type: ['', Validators.required],
      limit: [10, Validators.required], // Default limit
    });
    this.games.push(gameGroup);
  }

  removeGame(index: number): void {
    this.games.removeAt(index);
  }

  addGameAdd(): void {
    const gameGroup = this.fb.group({
      type: ['', Validators.required],
      limit: [10, Validators.required], // Default limit
    });
    this.addGames.push(gameGroup);
  }

  removeGameAdd(index: number): void {
    this.addGames.removeAt(index);
  }

  addSchedule(): void {
    this.submitted = true;

    if (this.AddForm.invalid) {
      return;
    }

    const newSchedule = {
      day: this.AddForm.controls['day'].value,
      time: this.AddForm.controls['time'].value,
      description: this.AddForm.controls['description'].value,
      games: this.addGames.value,
    };

    this.services.addSchedule(newSchedule).then(
      (data) => {
        this.getQuotes();
        console.log('Schedule added successfully:', data);
        this.submitted = false;
        this.AddForm.reset();
        this.addGames.clear(); // Clear the games array
        $('#AddScheduleModal').modal('hide'); // Close modal
        this.successMessage = 'Schedule added successfully.';
        $('#SuccessModal').modal('show');
      },
      (error) => {
        console.error('Error adding schedule:', error);
      }
    );
  }

  resetForm(): void {
    this.AddForm.reset();
    this.games.clear();
    this.selectedLimits = [];
    this.submitted = false;
  }
  updateSchedule(): void {
    this.submitted = true;

    if (this.UpdateForm.invalid) {
      return;
    }

    const updatedData = {
      day: this.UpdateForm.controls['day'].value,
      time: this.UpdateForm.controls['time'].value,
      description: this.UpdateForm.controls['description'].value,
      games: this.games.value,
    };

    this.services.updateSchedule(this.updateId, updatedData).then(
      (data) => {
        this.getQuotes();
        console.log('Updated Schedule:', data);
        $('#UpdateModal').modal('hide');
        this.successMessage = 'Schedule updated successfully.';
        $('#SuccessModal').modal('show');
      },
      (error) => {
        console.error('Error updating schedule:', error);
      }
    );
  }
  deleteQuotes(id: any) {
    this.deleteId = id;
    console.log(this.deleteId);
  }
  removeSchedule(id: string): void {
    this.services.deleteSchedule(id).then(
      () => {
        this.schedule = this.schedule.filter(
          (schedules) => schedules.id !== id
        );
        console.log(`Deleted Schedule with ID ${id}`);
      },
      (error) => {
        console.error('Error deleting schedule:', error);
      }
    );
  }
  ConfirmDelete() {
    this.services.deleteSchedule(this.deleteId).then(
      () => {
        this.schedule = this.schedule.filter(
          (schedules) => schedules.id !== this.deleteId
        );
        this.getQuotes();
        console.log(`Deleted Schedule with ID ${this.deleteId}`);
      },
      (error) => {
        console.error('Error deleting schedule:', error);
      }
    );
    this.deleteId = undefined;
    $('#DeleteModal').modal('hide');
    this.successMessage = 'Schedule deleted successfully.';
    $('#SuccessModal').modal('show');
    // this.id = setInterval(() => {
    //   location.reload();
    //  }, 1000);
  }

  CancelDelete() {
    this.deleteId = undefined;
    location.reload();
  }
  fetchScheduleById(id: string): void {
    this.updateId = id;
    this.services.getScheduleById(id).then(
      (data) => {
        // Set basic fields
        this.viewSchedule = data;
        this.UpdateForm.controls['day'].setValue(data.day);
        this.UpdateForm.controls['time'].setValue(data.time);
        this.UpdateForm.controls['description'].setValue(data.description);

        // Clear the FormArray and populate with fetched games
        const gamesArray = this.UpdateForm.get('games') as FormArray;
        gamesArray.clear(); // Clear existing entries
        data.games.forEach((game: any) => {
          const gameGroup = this.fb.group({
            type: [game.type, Validators.required],
            limit: [game.limit, Validators.required],
          });
          gamesArray.push(gameGroup);
        });

        console.log('Schedule fetched and form populated:', data);
      },
      (error) => {
        console.error('Error fetching schedule:', error);
      }
    );
  }

  // getQuotesbyId(id: any) {
  //   this.updateId = id;
  //   this.services.getsingleQuote(id).subscribe((data: any) => {
  //     this.selectedQuote = data;
  //     this.UpdateForm.controls['mood'].setValue(data.mood + ',' + data.emotion);
  //     this.UpdateForm.controls['quote'].setValue(data.quote);
  //   });
  // }
  Reload() {
    location.reload();
  }
}
