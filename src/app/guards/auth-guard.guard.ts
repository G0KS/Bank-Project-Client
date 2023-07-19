import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToasterService } from '../services/toastr.service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const toaster = inject(ToasterService);
  const router = inject(Router);
  if (auth.isLoggedIn()) {
    return true;
  } else {
    toaster.showWarning('Operation denied, Please login!', 'Warning');
    router.navigateByUrl('');
    return false;
  }
};
