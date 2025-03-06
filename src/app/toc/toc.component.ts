import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicesService, Game } from '../services.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
declare var $: any;
@Component({
  selector: 'app-toc',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './toc.component.html',
  styleUrl: './toc.component.scss',
})
export class TocComponent {
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
  scheduleGames: any;
  selectedSchedule: any;
  selectedLimits: number[] = []; // Track slider values
  viewSchedule: any;
  selectedItem: any = null;
  checkinId: any;
  TocSettingsForm: FormGroup;
  tocSettings: any;
  tocSettingId: any;
  constructor(
    private services: ServicesService,
    public router: Router,

    private fb: FormBuilder
  ) {
    this.UpdateForm = this.fb.group({
      firstName: ['', Validators.required],
      lastInitial: ['', Validators.required],
      phone: ['', Validators.required],
      gameType: ['', Validators.required],
      smsUpdates: [Boolean, false],
      checkedIn: [Boolean, false],
    });
    this.AddForm = this.fb.group({
      firstName: ['', Validators.required],
      lastInitial: ['', Validators.required],
      phone: ['', Validators.required],
      gameType: ['', Validators.required],
      smsUpdates: [Boolean, false],
      checkedIn: [Boolean, false],
    });
    this.TocSettingsForm = this.fb.group({
      gameType: ['', Validators.required],
      is_live: [Boolean, false],
      buy_in: ['', Validators.required],
      seats: ['', Validators.required],
    });
  }
  get fvaladd() {
    return this.AddForm.controls;
  }
  get fvaltoc() {
    return this.TocSettingsForm.controls;
  }
  get fvalupdate() {
    return this.UpdateForm.controls;
  }

  ngOnInit(): void {
    this.getToc();
    this.getGames();
    this.getTocSettings();
  }

  getTocSettings() {
    this.services.getTocSettings().then((data) => {
      this.tocSettings = data;
      this.tocSettingId = this.tocSettings[0].id;
      this.TocSettingsForm.patchValue(this.tocSettings[0]);
    });
  }

  getToc() {
    this.services.getToc().then((data) => {
      this.schedule = data;
      console.log(this.schedule);
    });
  }
  getGames() {
    this.services.getAllGames().then((data) => {
      // Get today's date
      this.scheduleGames = data;
    });
  }

  addToc(): void {
    this.submitted = true;

    if (this.AddForm.invalid) {
      return;
    }

    const newToc = {
      firstName: this.AddForm.controls['firstName'].value,
      lastInitial: this.AddForm.controls['lastInitial'].value,
      phone: this.AddForm.controls['phone'].value,
      gameType: this.AddForm.controls['gameType'].value,
      smsUpdates: this.AddForm.controls['smsUpdates'].value,
      checkedIn: this.AddForm.controls['checkedIn'].value,
    };

    this.services.addToToc(newToc).then(
      (data) => {
        this.getToc();

        this.submitted = false;
        this.AddForm.reset();
        $('#AddTocModal').modal('hide');
        if (data != undefined) {
          this.successMessage = 'Toc added successfully.';
          $('#SuccessModal').modal('show');
        }
      },
      (error) => {
        console.error('Error adding Toc:', error);
      }
    );
  }

  resetForm(): void {
    this.AddForm.reset();

    this.selectedLimits = [];
    this.submitted = false;
  }
  updateToc(): void {
    this.submitted = true;

    if (this.UpdateForm.invalid) {
      return;
    }

    const updatedData = {
      firstName: this.UpdateForm.controls['firstName'].value,
      lastInitial: this.UpdateForm.controls['lastInitial'].value,
      phone: this.UpdateForm.controls['phone'].value,
      gameType: this.UpdateForm.controls['gameType'].value,
      smsUpdates: this.UpdateForm.controls['smsUpdates'].value,
      checkedIn: this.UpdateForm.controls['checkedIn'].value,
    };

    this.services.updateToToc(this.updateId, updatedData).then(
      (data) => {
        this.getToc();
        console.log('Updated Toc:', data);
        $('#UpdateModal').modal('hide');
        this.successMessage = 'Toc updated successfully.';
        $('#SuccessModal').modal('show');
      },
      (error) => {
        console.error('Error updating Toc:', error);
      }
    );
  }

  updateTocSettings() {
    this.submitted = true;

    if (this.TocSettingsForm.invalid) {
      return;
    }

    const updatedData = this.TocSettingsForm.value;

    this.services.updateTocSettings(this.tocSettingId, updatedData).then(
      (data) => {
        this.TocSettingsForm.reset;
        this.getTocSettings();

        $('#TocSettingsModal').modal('hide');
        this.successMessage = 'Toc settings updated successfully.';
        $('#SuccessModal').modal('show');
      },
      (error) => {
        console.error('Error updating Toc:', error);
      }
    );
  }
  deleteToc(id: any) {
    this.deleteId = id;
    console.log(this.deleteId);
  }
  removeToc(id: string): void {
    this.services.deleteToc(id).then(
      () => {
        this.schedule = this.schedule.filter(
          (schedules) => schedules.id !== id
        );
        console.log(`Deleted Toc with ID ${id}`);
      },
      (error) => {
        console.error('Error deleting Toc:', error);
      }
    );
  }
  ConfirmDelete() {
    this.services.deleteToc(this.deleteId).then(
      () => {
        this.schedule = this.schedule.filter(
          (schedules) => schedules.id !== this.deleteId
        );
        this.getToc();
        console.log(`Deleted Toc with ID ${this.deleteId}`);
      },
      (error) => {
        console.error('Error deleting Toc:', error);
      }
    );
    this.deleteId = undefined;
    $('#DeleteModal').modal('hide');
    this.successMessage = 'Toc deleted successfully.';
    $('#SuccessModal').modal('show');
    // this.id = setInterval(() => {
    //   location.reload();
    //  }, 1000);
  }
  ConfirmCheckin() {
    this.services.checkInToc(this.checkinId).then(() => {
      this.getToc();
    });
    this.checkinId = undefined;
    $('#CheckinModal').modal('hide');
    this.successMessage = 'Toc checked in successfully.';
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
