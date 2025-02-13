import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ServicesService, GalleryItem } from '../services.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
declare var $: any;
@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent implements OnInit {
  GalleryForm: FormGroup;
  submitted = false;
  selectedImage: File | null = null;
  imageError = '';
  selectedItem: any = null;
  updateForm: FormGroup;
  gallery: GalleryItem[] = [];
  constructor(private fb: FormBuilder, private services: ServicesService) {
    this.GalleryForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.updateForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required],
    });
  }
  ngOnInit() {
    this.getGalleryItems();
  }

  getGalleryItems() {
    this.services.getGallery().then((data) => {
      this.gallery = data;
      console.log(this.gallery);
    });
  }
  deleteImage(id: string) {
    this.services.deleteGalleryItem(id).then(() => {
      this.getGalleryItems();
    });
  }

  viewImage(item: any) {
    this.selectedItem = item;
  }

  setUpdateData(item: any) {
    this.selectedItem = item;
    console.log(this.selectedItem);
    this.updateForm.patchValue(item);
  }

  updateImage() {
    // Get the form data
    const updatedData = this.updateForm.value;
    console.log(this.selectedItem);
    // If a new image is selected, append it to the form data
    if (this.selectedImage) {
      const formData = new FormData();
      formData.append('title', updatedData.title);
      formData.append('description', updatedData.description);
      formData.append('image', this.selectedImage); // Append the new image if selected
      this.services
        .updateGalleryItem(this.selectedItem.id, formData)
        .then(() => {
          this.getGalleryItems();
          $('#UpdateGalleryModal').modal('hide'); // Close modal after update
        });
    } else {
      // If no new image is selected, only update title and description
      this.services
        .updateGalleryItem(this.selectedItem.id, updatedData)
        .then(() => {
          this.getGalleryItems();
          $('#UpdateGalleryModal').modal('hide'); // Close modal after update
        });
    }
  }

  fetchGalleryItemById(id: string) {
    // this.services.getGalleryItemById(id).then((data) => {
    //   console.log(data);
    //   // Use the fetched data as needed (e.g., display in a modal for update/view)
    // });
  }
  get fvalGallery() {
    return this.GalleryForm.controls;
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.imageError = 'Only JPG and PNG images are allowed.';
        this.selectedImage = null;
        return;
      }

      this.imageError = '';
      this.selectedImage = file;
    }
  }

  addGalleryItem(): void {
    this.submitted = true;

    if (this.GalleryForm.invalid || !this.selectedImage) {
      return;
    }

    const formData = new FormData();
    formData.append('title', this.GalleryForm.controls['title'].value);
    formData.append(
      'description',
      this.GalleryForm.controls['description'].value
    );
    formData.append('image', this.selectedImage);

    this.services.addGalleryItem(formData).then(
      (response) => {
        console.log('Gallery item added successfully:', response);
        this.submitted = false;
        this.GalleryForm.reset();
        this.selectedImage = null;
        this.getGalleryItems();
        $('#AddGalleryModal').modal('hide');
      },
      (error) => {
        console.error('Error adding gallery item:', error);
      }
    );
  }
}
