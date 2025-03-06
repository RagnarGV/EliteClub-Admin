import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ServicesService } from '../services.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-special-events',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './special-events.component.html',
  styleUrl: './special-events.component.scss',
})
export class SpecialEventsComponent implements OnInit {
  events: any[] = [];
  eventForm: FormGroup;
  updateForm: FormGroup;
  submitted = false;
  deleteId: string | undefined;
  updateId: string | undefined;
  successMessage: string = '';
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  updateImagePreview: string | null = null;
  previewModalImage: string = '';
  isLive: boolean = false;

  constructor(private services: ServicesService, private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      event_name: ['', Validators.required],
      event_description: ['', Validators.required],
      event_image: ['', Validators.required],
      url: ['', Validators.required],
      is_live: [Boolean, false],
    });

    this.updateForm = this.fb.group({
      event_name: ['', Validators.required],
      event_description: ['', Validators.required],
      event_image: [''],
      url: [''],
      is_live: [Boolean, false],
    });
  }

  ngOnInit(): void {
    this.getAllEvents();
  }

  get fval() {
    return this.eventForm.controls;
  }

  get fvalUpdate() {
    return this.updateForm.controls;
  }

  getAllEvents() {
    this.services
      .getAllEvents()
      .then((response) => {
        this.events = response;
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.eventForm.patchValue({ event_image: file });

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onUpdateFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.updateForm.patchValue({ event_image: file });

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.updateImagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  openImageModal(imageUrl: string): void {
    this.previewModalImage = imageUrl;
    $('#ImagePreviewModal').modal('show');
  }

  async addEvent() {
    this.submitted = true;
    if (this.eventForm.invalid) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('event_name', this.eventForm.get('event_name')?.value);
      formData.append(
        'event_description',
        this.eventForm.get('event_description')?.value
      );
      formData.append('is_live', this.eventForm.get('is_live')?.value);
      formData.append('url', this.eventForm.get('url')?.value);

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      await this.services.addEvent(formData);
      this.getAllEvents();
      this.submitted = false;
      this.eventForm.reset();
      this.selectedFile = null;
      this.imagePreview = null;
      $('#AddEventModal').modal('hide');
      this.successMessage = 'Event added successfully.';
      $('#SuccessModal').modal('show');
    } catch (error) {
      console.error('Error adding event:', error);
    }
  }

  async updateEvent() {
    this.submitted = true;
    if (this.updateForm.invalid) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('event_name', this.updateForm.get('event_name')?.value);
      formData.append(
        'event_description',
        this.updateForm.get('event_description')?.value
      );

      formData.append('is_live', this.updateForm.get('is_live')?.value);
      formData.append('url', this.updateForm.get('url')?.value);

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      await this.services.updateEvent(this.updateId!, formData);
      this.getAllEvents();
      $('#UpdateModal').modal('hide');
      this.successMessage = 'Event updated successfully.';
      $('#SuccessModal').modal('show');
      this.selectedFile = null;
      this.updateImagePreview = null;
    } catch (error) {
      console.error('Error updating event:', error);
    }
  }

  setUpdateData(event: any) {
    this.updateId = event.id;
    this.updateForm.patchValue({
      event_name: event.event_name,
      event_description: event.event_description,
      url: event.url,
      is_live: event.is_live === 0 ? false : true,
    });
    this.updateImagePreview = event.event_image;
  }

  deleteEvent(id: string) {
    this.deleteId = id;
  }

  async confirmDelete() {
    if (this.deleteId) {
      try {
        await this.services.deleteEvent(this.deleteId);
        this.getAllEvents();
        $('#DeleteModal').modal('hide');
        this.successMessage = 'Event deleted successfully.';
        $('#SuccessModal').modal('show');
        this.deleteId = undefined;
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  }

  cancelDelete() {
    this.deleteId = undefined;
  }
}
