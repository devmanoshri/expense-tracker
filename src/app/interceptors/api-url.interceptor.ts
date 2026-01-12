import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment';

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {

  const apiKey = environment.apiUrl;
  const realApiUrl = 'http://localhost:3000';

  if(req.url.includes(apiKey)){
    const updatedUrl = req.url.replace(apiKey, realApiUrl);
    const updatedReq = req.clone({
      url: updatedUrl,
    });

    return next(updatedReq);
  }
  
  return next(req);
};
