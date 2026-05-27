import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const originGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const navigation = router.getCurrentNavigation();

  if(navigation?.extras?.state && navigation.extras.state['data']){
    return true;
  }else{
    return router.parseUrl('/start-visit');
  }
};
