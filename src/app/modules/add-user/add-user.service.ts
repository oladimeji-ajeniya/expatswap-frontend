import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
import { User, UserList } from './user.types';

@Injectable({providedIn: 'root'})
export class UserService {
    private apiUrl = 'http://localhost:3009/api/user';

    private _httpClient = inject(HttpClient);
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User)
    {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User>
    {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get user
     */
    getUsers(page: number = 1, limit: number = 20, startDate?: string, endDate?: string): Observable<UserList[]> {
        // Construct the query parameters
        let params = new HttpParams()
          .set('page', page.toString())
          .set('limit', limit.toString());
    
        // Add startDate and endDate if provided
        if (startDate) {
          params = params.set('startDate', startDate);
        }
        if (endDate) {
          params = params.set('endDate', endDate);
        }
    
        // Make the HTTP GET request with the constructed parameters
        return this._httpClient.get<UserList[]>(this.apiUrl, { params }).pipe(
          tap((users: UserList[]) => {
            return users;
          })
        );
      }


    /**
     * Add user
     *
     * @param user
     */
    add(user: User): Observable<any>
    {

        return this._httpClient.post<User>(this.apiUrl, {user}).pipe(
            map((response) =>
            {
                this._user.next(response);
            }),
        );
    }

}