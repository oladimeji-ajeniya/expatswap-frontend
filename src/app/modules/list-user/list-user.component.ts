import { NgIf } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator'; 
import { User, UserList } from '../add-user/user.types';
import { UserService } from '../add-user/add-user.service';

@Component({
    selector     : 'list-user',
    standalone   : true,
    templateUrl  : './list-user.component.html',
    encapsulation: ViewEncapsulation.None,
    imports      : [RouterLink, NgIf, MatTableModule,MatPaginatorModule, FormsModule, ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule],

})
export class ListUserComponent
{
    displayedColumns: string[] = ['id', 'firstName', 'lastName', 'phoneNumber', 'email', 'dateOfBirth']; // Update displayedColumns
    dataSource: MatTableDataSource<User>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    searchForm: FormGroup; // Define searchForm FormGroup
    tableData: User[] = [];
    isSearch: boolean = false;
    count: string;

  constructor(private fb: FormBuilder, private userService: UserService,) {
    this.dataSource = new MatTableDataSource(this.tableData);
  }

  ngOnInit(): void {    
    this.searchForm = this.fb.group({
        startDate: [''],
        endDate: [''] 
      });  
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator.page.subscribe((event: PageEvent) => {
      this.getUsers(event.pageIndex + 1, event.pageSize); // Add 1 to pageIndex to make it 1-based
    });
    this.getUsers(1, this.paginator.pageSize);
  }

  getUsers(page: number, limit: number): void {
    const startDate = this.searchForm.get('startDate')?.value;
    const endDate = this.searchForm.get('endDate')?.value;

    this.userService.getUsers(page,limit,startDate,endDate)
      .subscribe(
        (data: any) => {
          this.tableData = data.users;
          this.dataSource.data = this.tableData;
          this.count = data.count;
          this.isSearch = false;
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
            this.count = data.count;
        },
        error => console.error('Error fetching users:', error)
      );
  }
}
