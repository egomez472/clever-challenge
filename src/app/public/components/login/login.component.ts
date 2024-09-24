import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../api/services/auth.service';
import { Router } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';

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
  selector: 'app-login',
  standalone: true,
  imports: modules,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  formGroup!: FormGroup;
  passwordType: string = 'password';

  private readonly messageSvc = inject(MessageService);
  private readonly authSvc = inject(AuthService)
  private readonly router = inject(Router)

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      password: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required)
    });
  }

  onSubmit(form: FormGroup) {
    const [username, password] = [form.value.username, form.value.password];
    if(form.valid) {
      this.authSvc.login(username, password).subscribe(
        response => {
          if(response) {
            this.router.navigate(['/products'])
          } else {
            this.messageSvc.add({ severity: 'error', summary: 'Credentials', detail: 'Incorrect username or password', key: 'br', life: 3000 });
          }
        }
      )
    } else {
      if(form.invalid) {
        if(form.get('username')?.invalid) {
          this.formGroup.get('username')?.markAsDirty()
        }
        if(form.get('password')?.invalid) {
          this.formGroup.get('password')?.markAsDirty()
        }
      }
    }
  }

  navigate(url:string) {
    this.router.navigate([url])
  }

  showPassword() {
    this.passwordType = this.passwordType == 'text' ? 'password' : 'text';
  }
}
