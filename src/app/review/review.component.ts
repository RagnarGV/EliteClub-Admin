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
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss',
})
export class ReviewComponent implements OnInit {
  reviews: any[] = [];
  reviewForm: FormGroup;
  updateForm: FormGroup;
  submitted = false;
  deleteId: string | undefined;
  updateId: string | undefined;
  successMessage: string = '';

  constructor(private services: ServicesService, private fb: FormBuilder) {
    this.reviewForm = this.fb.group({
      name: ['', Validators.required],
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      review: ['', Validators.required],
    });

    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      review: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllReviews();
  }

  get fval() {
    return this.reviewForm.controls;
  }
  get fvalUpdate() {
    return this.updateForm.controls;
  }

  getAllReviews() {
    this.services.getAllReviews().then((data) => {
      this.reviews = data;
    });
  }

  addReview(): void {
    this.submitted = true;
    if (this.reviewForm.invalid) {
      return;
    }

    this.services.addReview(this.reviewForm.value).then(
      (data) => {
        this.getAllReviews();
        this.submitted = false;
        this.reviewForm.reset();
        $('#AddReviewModal').modal('hide');
        this.successMessage = 'Review added successfully.';
        $('#SuccessModal').modal('show');
      },
      (error) => {
        console.error('Error adding review:', error);
      }
    );
  }

  updateReview(): void {
    this.submitted = true;
    if (this.updateForm.invalid) {
      return;
    }

    this.services.updateReview(this.updateId!, this.updateForm.value).then(
      (data) => {
        this.getAllReviews();
        $('#UpdateModal').modal('hide');
        this.successMessage = 'Review updated successfully.';
        $('#SuccessModal').modal('show');
      },
      (error) => {
        console.error('Error updating review:', error);
      }
    );
  }

  setUpdateData(review: any) {
    this.updateId = review.id;
    this.updateForm.patchValue(review);
  }

  deleteReview(id: string) {
    this.deleteId = id;
  }

  confirmDelete() {
    if (this.deleteId) {
      this.services.deleteReview(this.deleteId).then(
        () => {
          this.getAllReviews();
          $('#DeleteModal').modal('hide');
          this.successMessage = 'Review deleted successfully.';
          $('#SuccessModal').modal('show');
          this.deleteId = undefined;
        },
        (error) => {
          console.error('Error deleting review:', error);
        }
      );
    }
  }

  cancelDelete() {
    this.deleteId = undefined;
  }
}
