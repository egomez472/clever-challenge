import { computed, inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { UserStore } from '../../public/store/user.store';

export const hasRoleGuard: CanMatchFn = (route) => {
  console.log('#hasRoleGuard called');

  const userStore = inject(UserStore);
  const router = inject(Router)
  const allowedRoles = route.data?.['allowedRoles'];
  const hasRole =  Boolean(userStore.user() && allowedRoles.includes(userStore.user()?.rol))

  if(!hasRole) {
    router.navigate(['products'])
  }

  return hasRole
};
