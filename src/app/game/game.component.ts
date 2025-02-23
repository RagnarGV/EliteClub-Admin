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
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
  games: any[] = [];
  gameForm: FormGroup;
  updateForm: FormGroup;
  submitted = false;
  deleteId: string | undefined;
  updateId: string | undefined;
  successMessage: string = '';

  constructor(private services: ServicesService, private fb: FormBuilder) {
    this.gameForm = this.fb.group({
      type: ['', Validators.required],
      limit: ['', Validators.required],
    });

    this.updateForm = this.fb.group({
      type: ['', Validators.required],
      limit: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllGames();
  }

  get fval() {
    return this.gameForm.controls;
  }
  get fvalUpdate() {
    return this.updateForm.controls;
  }

  getAllGames() {
    this.services.getAllGames().then((data) => {
      this.games = data;
    });
  }

  addGame(): void {
    this.submitted = true;
    if (this.gameForm.invalid) {
      return;
    }

    this.services.addGame(this.gameForm.value).then(
      (data) => {
        this.getAllGames();
        this.submitted = false;
        this.gameForm.reset();
        $('#AddGameModal').modal('hide');
        this.successMessage = 'Game added successfully.';
        $('#SuccessModal').modal('show');
      },
      (error) => {
        console.error('Error adding game:', error);
      }
    );
  }

  updateGame(): void {
    this.submitted = true;
    if (this.updateForm.invalid) {
      return;
    }

    this.services.updateGame(this.updateId!, this.updateForm.value).then(
      (data) => {
        this.getAllGames();
        $('#UpdateModal').modal('hide');
        this.successMessage = 'Game updated successfully.';
        $('#SuccessModal').modal('show');
      },
      (error) => {
        console.error('Error updating game:', error);
      }
    );
  }

  setUpdateData(game: any) {
    this.updateId = game.id;
    this.updateForm.patchValue(game);
  }

  deleteGame(id: string) {
    this.deleteId = id;
  }

  confirmDelete() {
    if (this.deleteId) {
      this.services.deleteGame(this.deleteId).then(
        () => {
          this.getAllGames();
          $('#DeleteModal').modal('hide');
          this.successMessage = 'Game deleted successfully.';
          $('#SuccessModal').modal('show');
          this.deleteId = undefined;
        },
        (error) => {
          console.error('Error deleting game:', error);
        }
      );
    }
  }

  cancelDelete() {
    this.deleteId = undefined;
  }
}
