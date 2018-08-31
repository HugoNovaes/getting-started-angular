import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../user/user';
import { switchMap, tap } from 'rxjs/operators';
import { IronService } from '../iron/iron.service';
import { AwayTeamMember } from './away-team-member';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AwayTeamService {
  private readonly url = 'api/awayteam';
  readonly memberAdded$ = new Subject<AwayTeamMember>();
  readonly memberRemoved$ = new Subject<AwayTeamMember>();

  constructor(private http: HttpClient, private iron: IronService) {
  }

  add(user: User): Observable<any> {
    const atm = new AwayTeamMember(+user.id);
    user.isBeingAddedOrRemoved = true;
    return this.http.post<AwayTeamMember>(this.url, atm)
      .pipe(
        switchMap(() => this.iron.addUserToGroup(user, 'top-secret')),
        tap(() => user.isBeingAddedOrRemoved = false),
        tap(() => this.memberAdded$.next(atm))
      );
  }

  remove(user: User): Observable<any> {
    const atm = new AwayTeamMember(+user.id);
    user.isBeingAddedOrRemoved = true;
    return this.http.delete<AwayTeamMember>(this.url + `/${atm.id}`)
      .pipe(
        switchMap(() => this.iron.removeUserFromGroup(user, 'top-secret')),
        tap(() => user.isBeingAddedOrRemoved = false),
        tap(() => this.memberRemoved$.next(atm))
      );
  }
}
