import { inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { map, take } from 'rxjs';
import { Router } from '@angular/router';

export const authGuard = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return user(auth).pipe(
    take(1),
    map(u => u ? true : router.createUrlTree(['/login']))
  );
};
