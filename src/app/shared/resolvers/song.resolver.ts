import { take, find, first, map } from 'rxjs/operators';
import { SongService } from 'src/app/songs/services/song.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Song } from 'src/app/models/song';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({ providedIn: 'root' })
export class SongResolver implements Resolve<Song> {
  constructor(private _songService: SongService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<Song> | Promise<Song> | Song {
    return this._songService.songs !== undefined
      ? this._songService.songs.find((x) => x.id === route.params['id'])
      : this._songService.songs$
          .pipe(map((songs) => songs.find((song) => song.id === route.params['id'])))
          .pipe(first());
  }
}
