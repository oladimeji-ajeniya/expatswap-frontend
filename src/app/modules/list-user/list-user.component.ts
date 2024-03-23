import { NgIf } from '@angular/common';
import { of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator'; 
import { User } from '../add-user/user.types';
import { UserService } from '../add-user/add-user.service';

@Component({
  selector     : 'list-user',
  standalone   : true,
  templateUrl  : './list-user.component.html',
  encapsulation: ViewEncapsulation.None,
  imports      : [RouterLink, CommonModule, NgIf, MatTableModule,MatPaginatorModule, FormsModule, ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule],

})
export class ListUserComponent {
  selectedDate: Date;
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'phoneNumber', 'email', 'dateOfBirth'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  totalItems = 0;
  pageSize = 2; // Default page size
  totalPages = 0;
  searchForm: FormGroup; // Define searchForm FormGroup
  tableData: User[] = [];
  isSearch: boolean = false;
  isLoading = false;
  count: string;
  totalData: any;
  EmpData: any;

  dataSource = new MatTableDataSource<User>();
  pageSizes = [2, 3, 5, 7];

  constructor(private fb: FormBuilder, private userService: UserService) {
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      startDate: [''],
      endDate: ['']
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;
          return this.getTableData$(
            this.paginator.pageIndex + 1,
            this.paginator.pageSize
          ).pipe(catchError(() => observableOf(null)));
        }),
        map((data: any) => {
          if (data == null) return [];
          this.totalData = data.total;
          this.isLoading = false;
          return data.users;
        })
      )
      .subscribe((empData) => {
        this.EmpData = empData;
        this.dataSource = new MatTableDataSource(this.EmpData);
      });

  }

  getTableData$(pageNumber: number, pageSize: number) {
    const startDate = this.searchForm.get('startDate')?.value;
    const endDate = this.searchForm.get('endDate')?.value;

    return this.userService.getUsers(pageNumber, pageSize, startDate, endDate);
  }


  getUsers(page: number, limit: number): void {
    const startDate = this.searchForm.get('startDate')?.value;
    const endDate = this.searchForm.get('endDate')?.value;

    this.userService.getUsers(page, limit, startDate, endDate).subscribe(
      (data: any) => {
        this.tableData = data.users;
        this.dataSource.data = this.tableData;
        this.totalItems = data.total; // Update totalItems from the API response
        this.totalPages = Math.ceil(this.totalItems / this.pageSize); // Calculate total pages
        this.isSearch = false;

        // Update pagination if necessary
        if (this.totalItems > this.pageSize * this.paginator.pageSize) {
          this.paginator.pageSizeOptions = [this.pageSize, this.totalItems]; // Update pageSizeOptions to include totalItems
        }
      },
      error => console.error('Error fetching users:', error)
    );
  }
  

  search() {
    const startDate = this.searchForm.get('startDate')?.value;
    const endDate = this.searchForm.get('endDate')?.value;

    const page = this.paginator.pageIndex + 1;
    const limit = this.paginator.pageSize;

    // Disable the form
    this.searchForm.disable();

    // Call the API to get filtered data based on the search query, startDate, and endDate
    this.userService.getUsers(page, limit, startDate, endDate)
      .subscribe(
        (data: any) => {
          // Reset the form
          this.searchForm.reset();

          // Re-enable the form
          this.searchForm.enable();

          this.isSearch = true;

          this.tableData = data.users;
          this.dataSource.data = this.tableData;
          this.totalItems = data.total; // Update totalItems from the API response
          this.totalPages = Math.ceil(this.totalItems / this.pageSize); // Calculate total pages
          this.isSearch = false;

           // Update pagination if necessary
          if (this.totalItems > this.pageSize * this.paginator.pageSize) {
            this.paginator.pageSizeOptions = [this.pageSize, this.totalItems]; // Update pageSizeOptions to include totalItems
          }

        },
        error => console.error('Error fetching users:', error)
      );
  }


}

