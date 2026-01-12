import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MessageService } from '../components/shared/message/message.service';

export const transactionAccessGuard: CanActivateFn = (route, state) => {
  const messageService = inject(MessageService);

  const router = inject(Router);
  const authStatus = sessionStorage.getItem('authStatus');

  if (authStatus === 'authorise') {
    return true;
  } else {
    messageService.messsage$ = {
      text: 'Change your authorization status!',
      type: 'danger',
    };
    router.navigate(['/']);
    return false;
  }
};
