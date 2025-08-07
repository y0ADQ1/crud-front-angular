import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Person {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'male' | 'female';
  email: string;
  phoneNumber: string;
  isActive: boolean;
}

export interface PaginatedResponse {
  data: Person[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface StatsResponse {
  [key: string]: number;
}

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private apiUrl = 'http://localhost:3333/api';

  constructor(private http: HttpClient) {}

  getPeople(page: number = 1, perPage: number = 10): Observable<PaginatedResponse> {
    const params = new HttpParams().set('page', page.toString()).set('perPage', perPage.toString());
    return this.http.get<PaginatedResponse>(`${this.apiUrl}/people`, { params });
  }

  createPerson(person: Omit<Person, 'id' | 'isActive'>): Observable<{ message: string; person: Person }> {
    return this.http.post<{ message: string; person: Person }>(`${this.apiUrl}/people`, { ...person, isActive: true });
  }

  getPerson(id: number): Observable<{ message: string; person: Person }> {
    return this.http.get<{ message: string; person: Person }>(`${this.apiUrl}/people/${id}`);
  }

  updatePerson(id: number, person: Partial<Person>): Observable<{ message: string; person: Person }> {
    return this.http.put<{ message: string; person: Person }>(`${this.apiUrl}/people/${id}`, person);
  }

  deactivatePerson(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/people/${id}`);
  }

  getStats(filter: 'default' | 'age' | 'combined' = 'default'): Observable<StatsResponse> {
    const params = new HttpParams().set('filter', filter);
    return this.http.get<StatsResponse>(`${this.apiUrl}/people/stats`, { params });
  }
}
