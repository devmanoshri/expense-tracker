import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MessageService } from '../components/shared/message/message.service';

export const transactionAccessGuard: CanActivateFn = (route, state) => {
  const messageService = inject(MessageService);

  const router = inject(Router);
  const stored = sessionStorage.getItem('authStatus');

  if (stored) {
    const authStatus = JSON.parse(stored);

    if (authStatus.name === 'authorise') {
      return true;
    }
  }

  messageService.messsage$ = {
    text: 'Change your authorization status!',
    type: 'danger',
  };

  router.navigate(['/']);
  return false;
};
