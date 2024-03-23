import { NgIf, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { UserService } from './add-user.service';
import { ExpatswapAlertComponent, ExpatswapAlertType } from '@expatswap/alert';
import { expatswapAnimations } from '@expatswap/animations';
import { ExpatswapValidators } from '@expatswap/validators';

@Component({
    selector     : 'add-user',
    standalone   : true,
    templateUrl  : './add-user.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : expatswapAnimations,
    imports      : [RouterLink, NgIf, ExpatswapAlertComponent, FormsModule, ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],

})
export class AddUserComponent implements OnInit
{
    @ViewChild('addUserNgForm') addUserNgForm: NgForm;

    alert: { type: ExpatswapAlertType; message: string } = {
        type   : 'success',
        message: '',
    };
    addUserForm: UntypedFormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _userService: UserService,
        private datePipe: DatePipe
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.addUserForm = this._formBuilder.group({
                firstName      : ['', Validators.required],
                lastName       : ['', Validators.required],
                phoneNumber    : ['', Validators.required],
                email          : ['', [Validators.required, Validators.email]],
                password       : ['', [Validators.required, ExpatswapValidators.passwordValidator()]],
                dateOfBirth    :  ['', Validators.required],
            },
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * getter for password control
     */
    get passwordControl() {
        return this.addUserForm.get('password');
    }

    addUser(): void {
        // Do nothing if the form is invalid
        if (this.addUserForm.invalid) {
            return;
        }
    
        // Disable the form
        this.addUserForm.disable();
     
        // Hide the alert
        this.showAlert = false;
    
        // Check if email already exists
        this.checkUser(this.addUserForm.value.email);
    }
    
    checkUser(email: string) {
        this._userService.checkUserExists(email).subscribe(response => {
            if (response.exists) {
                // Set the alert
                this.alert = {
                    type   : 'error',
                    message: 'Email exists',
                };
    
                // Show the alert
                this.showAlert = true;
    
                // Re-enable the form
                this.addUserForm.enable();
            } else {
                // If the email does not exist, proceed to add the user
                this._userService.add(this.addUserForm.value)
                    .subscribe(
                        () => {
                            const redirectURL = '/list-user';
    
                            // Navigate to the redirect url
                            this._router.navigateByUrl(redirectURL);
                        },
                        (error) => {
                            // Re-enable the form
                            this.addUserForm.enable();
    
                            // Set the alert
                            this.alert = {
                                type   : 'error',
                                message: 'Error adding user',
                            };
    
                            // Show the alert
                            this.showAlert = true;
    
                            console.error('Error occurred:', error);
                        }
                    );
            }
        }, error => {
            console.error('Error occurred:', error);
        });
    }

    
}
