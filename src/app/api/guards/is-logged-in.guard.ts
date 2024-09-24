import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { UserStore } from '../../public/store/user.store';

export const isLoggedInGuard: CanMatchFn = () => {
  const router = inject(Router)
  const userStore = inject(UserStore);
  console.log('#isLoggedInGuard called');

  return Boolean(userStore.user() !== null) || router.createUrlTree(['/login']);
};
