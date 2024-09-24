import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { User } from "../../api/models/User.model";
import { userMapper } from "../../api/mappers/user-mapper";
import { computed } from "@angular/core";
import { Observable } from "rxjs";
import { toObservable } from "@angular/core/rxjs-interop";

export interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: getUserFromLocalStorage()
}

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(({user, ...store}) => ({

    userSignal() {
      return user;
    },

    saveUserInStorage(user: User) {
      const updatedUser = userMapper(user);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      patchState(store, {user: updatedUser});
    },

    removeUserOfStorage() {
      const userGuest = new User('','Guest','','','','GUEST', []);
      localStorage.setItem('user', JSON.stringify(userGuest))
      patchState(store, {user: userGuest});
    }

  }))
)

function getUserFromLocalStorage(): User | null {
  const userData = localStorage.getItem('user');
  const userGuest = new User('','Guest','','','','GUEST', []);
  if(Boolean(!userData)) {
    localStorage.setItem('user', JSON.stringify(userGuest))
  }
  return userData ? JSON.parse(userData) : userGuest;
}
