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
  errors: string[] = [];

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
        this.errors = [err.error?.message || 'Error al cargar personas'];
      },
    });
  }

  openCreateForm() {
    this.showCreateForm = true;
    this.newPerson = { firstName: '', lastName: '', age: 0, gender: 'male', email: '', phoneNumber: '' };
    this.errors = [];
  }

  createPerson() {
    this.personService.createPerson(this.newPerson).subscribe({
      next: () => {
        this.showCreateForm = false;
        this.loadPeople();
      },
      error: (err) => {
        this.errors = err.error?.errors?.map((e: any) => e.message) || [err.error?.message || 'Error al crear persona'];
      },
    });
  }

  editPerson(person: Person) {
    this.selectedPerson = { ...person };
    this.showEditForm = true;
    this.errors = [];
  }

  updatePerson() {
    if (this.selectedPerson) {
      this.personService.updatePerson(this.selectedPerson.id, this.selectedPerson).subscribe({
        next: () => {
          this.showEditForm = false;
          this.loadPeople();
        },
        error: (err) => {
          this.errors = err.error?.errors?.map((e: any) => e.message) || [err.error?.message || 'Error al actualizar persona'];
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
        this.errors = [err.error?.message || 'Error al desactivar persona'];
      },
    });
  }
}
