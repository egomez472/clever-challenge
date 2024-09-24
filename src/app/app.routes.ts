import { Routes } from '@angular/router';
import { isLoggedInGuard } from './api/guards/is-logged-in.guard';
import { hasRoleGuard } from './api/guards/has-role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./public/components/auth/auth.component').then((c) => c.AuthComponent),
    data: {
      isLogin: true
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./public/components/auth/auth.component').then((c) => c.AuthComponent),
    data: {
      isLogin: false
    }
  },
  {
    path: 'products',
    loadComponent: () => import('./components/catalog/products/products.component').then((c) => c.ProductsComponent),
  },
  {
    path: 'product-details/:id',
    loadComponent: () => import('./components/catalog/product-detail/product-detail.component').then((c) => c.ProductDetailComponent),
  },
  {
    path: 'cart',
    loadComponent: () => import('./components/cart/cart.component').then((c) => c.CartComponent),
  },
  {
    path: 'product/:action',
    canActivate: [hasRoleGuard],
    canMatch: [hasRoleGuard, isLoggedInGuard],
    data: {
      allowedRoles: ['ADMIN']
    },
    loadComponent: () => import('./components/catalog/add-product/add-product.component').then((c) => c.AddProductComponent)
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
