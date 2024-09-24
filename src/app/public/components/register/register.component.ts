import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { debounceTime } from 'rxjs';
import { AuthService } from '../../../api/services/auth.service';
import { RegisterModel } from '../../../api/models/Register.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '../../../api/models/User.model';
import { UserStore } from '../../store/user.store';

const modules = [
  CommonModule,
  ReactiveFormsModule,
  InputTextModule,
  PasswordModule,
  ButtonModule,
  RippleModule,
  FormsModule,
  InputGroupModule,
  InputGroupAddonModule,
  ToastModule,
  DividerModule
]

@Component({
  selector: 'app-register',
  standalone: true,
  imports: modules,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authSvc = inject(AuthService)
  private readonly messageSvc = inject(MessageService)
  private readonly userStore = inject(UserStore)

  private readonly EMAIL_REGEXP = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$');
  private readonly PASSWORD_REGEXP = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9s])([a-zA-Z0-9]|[^a-zA-Z0-9s]){8,50}$');

  password!: string;
  passwordType: string = 'password';
  formGroup!: FormGroup;
  isPatternError: boolean = false;
  emptyPassword: boolean = false;

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      username: new FormControl('', Validators.compose([Validators.minLength(4), Validators.required])),
      email: new FormControl('', Validators.compose([Validators.maxLength(100), Validators.required, Validators.email, Validators.pattern(this.EMAIL_REGEXP)])),
      password: new FormControl('', Validators.compose([Validators.minLength(8), Validators.maxLength(50), Validators.pattern(this.PASSWORD_REGEXP), Validators.required])),
      password_confirm: new FormControl('', Validators.compose([Validators.minLength(8), Validators.maxLength(50), Validators.pattern(this.PASSWORD_REGEXP), Validators.required]))
    },
    {
      validators: this.matchingPasswords()
    });
  }

  get firstnameControl() {
    return this.formGroup.get('firstname');
  }

  get lastnameControl() {
    return this.formGroup.get('lastname');
  }

  get usernameControl() {
    return this.formGroup.get('username');
  }

  get emailControl() {
    return this.formGroup.get('email');
  }

  get passwordControl() {
    return this.formGroup.get('password');
  }

  get passwordConfirmControl() {
    return this.formGroup.get('password_confirm');
  }

  getErrorType(control: AbstractControl | null): string | null {
    if (control?.dirty && control?.hasError('required')) {
      return 'required';
    }
    if (control?.dirty && control?.hasError('pattern')) {
      return 'pattern';
    }
    if(control?.dirty && control?.hasError('minlength')) {
      return 'minlength';
    }
    if(control?.dirty && control?.parent?.hasError('notSame')) {
      return 'notSame'
    }
    return null;
  }

  hasError(control: AbstractControl | null, error: string): boolean {
    return (control?.dirty && control?.hasError(error)) ?? false;
  }

  matchingPasswords(): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      const password = formGroup.get('password')?.value;
      const confirmation = formGroup.get('password_confirm')?.value;
      return password === confirmation ? null : { notSame: true };
    };
  }

  async onSubmit(form: FormGroup) {
    if(form.valid) {
      const values = form.value
      const credentials = new RegisterModel(
        values.username,
        values.firstname,
        values.lastname,
        values.email,
        values.password,
        'USER',
        []
      )
      const emailAlreadyExist = await this.authSvc.findByEmail(credentials.email);
      const usernameAlreadyExist = await this.authSvc.findByUsername(credentials.username);

      if(emailAlreadyExist) {
        this.messageSvc.add({ severity: 'error', summary: 'Already exist', detail: 'The email is already registered', key: 'br', life: 3000 });
        return;
      }

      if(usernameAlreadyExist) {
        this.messageSvc.add({ severity: 'error', summary: 'Already exist', detail: 'The username is already registered', key: 'br', life: 3000 });
        return;
      }

      this.authSvc.register(credentials).subscribe(
        (response: User) => {
          if(response.id) {
            this.userStore.saveUserInStorage(response);
            this.messageSvc.add({ severity: 'success', summary: 'Well done!', detail: 'User successfully created, you will be redirected in 3 seconds...', key: 'br', life: 3000 });
            setTimeout(() => {
              this.navigate('products');
            }, 3000);
          }
        }
      )

    }
  }

  navigate(url:string) {
    this.router.navigate([url])
  }

  showPassword() {
    this.passwordType = this.passwordType == 'text' ? 'password' : 'text';
  }
}
