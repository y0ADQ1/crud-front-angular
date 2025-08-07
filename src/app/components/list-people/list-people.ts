import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonService, Person, PaginatedResponse } from '../../services/person';
import { AuthService } from '../../services/auth';
import { RouterLink } from '@angular/router';
import { ErrorComponent } from '../error/error';

@Component({
  selector: 'app-list-people',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ErrorComponent],
  templateUrl: './list-people.html',
  styleUrls: ['./list-people.scss'],
})
export class ListPeopleComponent implements OnInit {
  people: PaginatedResponse | null = null;
  pagination: PaginatedResponse = { data: [], meta: { total: 0, per_page: 10, current_page: 1, last_page: 1 } };
  showInactive: boolean = false;
  showCreateForm: boolean = false;
  showEditForm: boolean = false;
  newPerson: Omit<Person, 'id' | 'isActive'> = { firstName: '', lastName: '', age: 0, gender: 'male', email: '', phoneNumber: '' };
  selectedPerson: Person | null = null;
  fieldErrors: { [key: string]: string[] } = {
    firstName: [],
    lastName: [],
    age: [],
    gender: [],
    email: [],
    phoneNumber: []
  };
  generalErrors: string[] = [];

  constructor(public authService: AuthService, private personService: PersonService) {}

  ngOnInit() {
    this.loadPeople();
  }

  loadPeople(page: number = 1) {
    this.personService.getPeople(page).subscribe({
      next: (data) => {
        this.people = {
          ...data,
          data: this.showInactive ? data.data : data.data.filter(p => p.isActive),
        };
        this.pagination = data;
      },
      error: (err) => {
  this.generalErrors = [err.error?.message || 'Error al cargar personas'];
      },
    });
  }

  openCreateForm() {
    this.showCreateForm = true;
    this.newPerson = { firstName: '', lastName: '', age: 0, gender: 'male', email: '', phoneNumber: '' };
    this.clearErrors();
  }

  clearErrors() {
    this.fieldErrors = {
      firstName: [],
      lastName: [],
      age: [],
      gender: [],
      email: [],
      phoneNumber: []
    };
    this.generalErrors = [];
  }

  createPerson() {
    this.clearErrors();
    this.personService.createPerson(this.newPerson).subscribe({
      next: () => {
        this.showCreateForm = false;
        this.loadPeople();
      },
      error: (err) => {
        const errors = err.error?.errors;
        if (Array.isArray(errors)) {
          errors.forEach((e: any) => {
            if (e.field && this.fieldErrors[e.field] !== undefined) {
              this.fieldErrors[e.field].push(e.message);
            } else {
              this.generalErrors.push(e.message);
            }
          });
        } else if (err.error?.message) {
          this.generalErrors.push(err.error.message);
        } else {
          this.generalErrors.push('Error al crear persona');
        }
      },
    });
  }

  editPerson(person: Person) {
    this.selectedPerson = { ...person };
    this.showEditForm = true;
    this.clearErrors();
  }

  updatePerson() {
    if (this.selectedPerson) {
      this.clearErrors();
      this.personService.updatePerson(this.selectedPerson.id, this.selectedPerson).subscribe({
        next: () => {
          this.showEditForm = false;
          this.loadPeople();
        },
        error: (err) => {
          const errors = err.error?.errors;
          if (Array.isArray(errors)) {
            errors.forEach((e: any) => {
              if (e.field && this.fieldErrors[e.field] !== undefined) {
                this.fieldErrors[e.field].push(e.message);
              } else {
                this.generalErrors.push(e.message);
              }
            });
          } else if (err.error?.message) {
            this.generalErrors.push(err.error.message);
          } else {
            this.generalErrors.push('Error al actualizar persona');
          }
        },
      });
    }
  }

  deactivatePerson(id: number) {
    this.personService.deactivatePerson(id).subscribe({
      next: () => {
        this.loadPeople();
      },
      error: (err) => {
  this.generalErrors = [err.error?.message || 'Error al desactivar persona'];
      },
    });
  }
}
