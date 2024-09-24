import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet, Route } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './api/services/auth.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { RolesDirective } from './public/directives/roles.directive';
import { ToolbarModule } from 'primeng/toolbar';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { PrimeNGConfig } from 'primeng/api';
import { User } from './api/models/User.model';
import { TagModule } from 'primeng/tag';
import { CartStore } from './public/store/cart.store';
import { UserStore } from './public/store/user.store';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

const modules = [
  CommonModule,
  RouterOutlet,
  RouterLink,
  RolesDirective,
  ToolbarModule,
  MenubarModule,
  AvatarModule,
  TagModule,
  ButtonModule,
  ToastModule,
  ConfirmDialogModule
]

@Component({
  selector: 'app-root',
  standalone: true,
  imports: modules,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class AppComponent implements OnInit{

  private readonly authSvc = inject(AuthService);
  private readonly router = inject(Router);
  private readonly primengConfig = inject(PrimeNGConfig);
  private readonly messageSvc = inject(MessageService);
  private readonly confirmationSvc = inject(ConfirmationService)
  userStore = inject(UserStore);
  cartStore = inject(CartStore);
  isLoginOrRegister: boolean = false;

  user: User | null = this.userStore.user();
  loading: boolean = false;

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  logout(event: Event) {
    this.confirmationSvc.confirm({
      target: event.target as EventTarget,
      message: '¿Are you sure you want to log out?',
      header: 'Attention',
      icon: 'pi pi-sign-out',
      acceptIcon:"none",
      rejectIcon:"none",
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass:"p-button-text p-button-success",
      accept: () => {
        this.user = null;
        this.authSvc.logout();
        this.cartStore.clearCart();
        this.router.navigate(['products'])
        this.messageSvc.add({ severity: 'success', summary: 'Session', detail: 'You are logged out', key:'br', life:1500});
      }
    });
  }

  signIn() {
    this.navigate('login')
  }

  routerState(): string {
    return this.router.url;
  }

  navigate(url: string) {
    this.router.navigate([url]);
  }

  items: MenuItem[] = [
    {
      label: 'Catalog',
      icon: 'pi pi-shop',
      command: () => this.router.navigate(['products'])
    },
    {
      label: 'Add product',
      icon: 'pi pi-plus-circle',
      command: () => this.router.navigate(['product', 'add'])
    },
    {
      label: 'Cart',
      icon: 'pi pi-shopping-cart',
      command: () => this.router.navigate(['cart'])
    }
  ];
}
