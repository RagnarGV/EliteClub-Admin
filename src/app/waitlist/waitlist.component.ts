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
  selector: 'app-waitlist',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './waitlist.component.html',
  styleUrl: './waitlist.component.scss',
})
export class WaitlistComponent {
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
  schedule: any[] = [];
  scheduleGames: Game[] = [];
  selectedSchedule: any;
  selectedLimits: number[] = []; // Track slider values
  viewSchedule: any;
  selectedItem: any = null;
  checkinId: any;
  constructor(
    private services: ServicesService,
    public router: Router,

    private fb: FormBuilder
  ) {
    this.UpdateForm = this.fb.group({
      firstName: ['', Validators.required],
      lastInitial: ['', Validators.required],
      phone: ['', Validators.required],
      smsUpdates: [Boolean, false],
      checkedIn: [Boolean, false],
    });
    this.AddForm = this.fb.group({
      firstName: ['', Validators.required],
      lastInitial: ['', Validators.required],
      phone: ['', Validators.required],
      smsUpdates: [Boolean, false],
      checkedIn: [Boolean, false],
    });
  }
  get fvaladd() {
    return this.AddForm.controls;
  }
  get fvalupdate() {
    return this.UpdateForm.controls;
  }

  ngOnInit(): void {
    this.getWaitlist();
  }

  getWaitlist() {
    this.services.getWaitlist().then((data) => {
      this.schedule = data;
      console.log(this.schedule);
    });
  }

  addSchedule(): void {
    this.submitted = true;

    if (this.AddForm.invalid) {
      return;
    }

    const newSchedule = {
      firstName: this.AddForm.controls['firstName'].value,
      lastInitial: this.AddForm.controls['lastInitial'].value,
      phone: this.AddForm.controls['phone'].value,
      smsUpdates: this.AddForm.controls['smsUpdates'].value,
      checkedIn: this.AddForm.controls['checkedIn'].value,
    };

    this.services.addToWaitlist(newSchedule).then(
      (data) => {
        this.getWaitlist();
        console.log('Waitlist added successfully:', data);
        this.submitted = false;
        this.AddForm.reset();

        $('#AddScheduleModal').modal('hide'); // Close modal
        this.successMessage = 'Waitlist added successfully.';
        $('#SuccessModal').modal('show');
      },
      (error) => {
        console.error('Error adding Waitlist:', error);
      }
    );
  }

  resetForm(): void {
    this.AddForm.reset();

    this.selectedLimits = [];
    this.submitted = false;
  }
  updateSchedule(): void {
    this.submitted = true;

    if (this.UpdateForm.invalid) {
      return;
    }

    const updatedData = {
      firstName: this.UpdateForm.controls['firstName'].value,
      lastInitial: this.UpdateForm.controls['lastInitial'].value,
      phone: this.UpdateForm.controls['phone'].value,
      smsUpdates: this.UpdateForm.controls['smsUpdates'].value,
      checkedIn: this.UpdateForm.controls['checkedIn'].value,
    };

    this.services.updateToWaitlist(this.updateId, updatedData).then(
      (data) => {
        this.getWaitlist();
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
    this.services.deleteWaitlist(id).then(
      () => {
        this.schedule = this.schedule.filter(
          (schedules) => schedules.id !== id
        );
        console.log(`Deleted waitlist with ID ${id}`);
      },
      (error) => {
        console.error('Error deleting waitlist:', error);
      }
    );
  }
  ConfirmDelete() {
    this.services.deleteWaitlist(this.deleteId).then(
      () => {
        this.schedule = this.schedule.filter(
          (schedules) => schedules.id !== this.deleteId
        );
        this.getWaitlist();
        console.log(`Deleted waitlist with ID ${this.deleteId}`);
      },
      (error) => {
        console.error('Error deleting waitlist:', error);
      }
    );
    this.deleteId = undefined;
    $('#DeleteModal').modal('hide');
    this.successMessage = 'waitlist deleted successfully.';
    $('#SuccessModal').modal('show');
    // this.id = setInterval(() => {
    //   location.reload();
    //  }, 1000);
  }
  ConfirmCheckin() {
    this.services.checkInWaitlist(this.checkinId).then(() => {
      this.getWaitlist();
    });
    this.checkinId = undefined;
    $('#CheckinModal').modal('hide');
    this.successMessage = 'Waitlist checked in successfully.';
    $('#SuccessModal').modal('show');
  }
  CancelCheckin() {
    this.checkinId = undefined;
  }
  CancelDelete() {
    this.deleteId = undefined;
  }
  setUpdateData(item: any) {
    this.selectedItem = item;
    this.updateId = item.id;
    this.checkinId = item.id;
    console.log(this.selectedItem);
    this.UpdateForm.patchValue(item);
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
