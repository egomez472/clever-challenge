import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../models/User.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserStore } from '../../public/store/user.store';
import { RegisterModel } from '../models/Register.model';
import { CartService } from './cart.service';
import { CartStore } from '../../public/store/cart.store';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = 'http://localhost:3000'
  private readonly _http = inject(HttpClient);
  private readonly userState = inject(UserStore);
  private readonly cartSvc = inject(CartService);
  private readonly cartStore = inject(CartStore);

  login(username: string, password?: string): Observable<boolean> {
    return this._http.get<User[]>(`${this.baseUrl}/users?username=${username}&password=${password}`)
      .pipe(
        map(users => {
          if(users.length > 0) {
            this.userState.saveUserInStorage(users[0]);
            if(users[0].cart.length > 0) {
              console.log(users[0].cart);
              this.cartStore.addToCartItems(users[0].cart);
            }
            return true;
          }
          return false;
        })
      )
  }

  logout(): void {
    this.userState.removeUserOfStorage();
  }

  findByEmail(email: string) {
    return new Promise((resolve, reject): void => {
      this._http.get<User[]>(`${this.baseUrl}/users?email=${email}`)
        .subscribe((response: User[]) => {
          if(response.length > 0) {
            resolve(true)
          } else {
            resolve(false)
          }
        });
    });
  }

  findByUsername(username: string) {
    return new Promise((resolve, reject): void => {
      this._http.get<User[]>(`${this.baseUrl}/users?username=${username}`)
        .subscribe((response: User[]) => {
          if(response.length > 0) {
            resolve(true)
          } else {
            resolve(false)
          }
        });
    });
  }

  register(credentials: RegisterModel): Observable<User> {
    return this._http.post<User>(`${this.baseUrl}/users`, credentials)
      .pipe(
        map(users => {
          console.log(users);
          return users;
        })
      )
  }

}
