import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { WaitlistComponent } from './waitlist/waitlist.component';
import { GalleryComponent } from './gallery/gallery.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth.guard';
import { GameComponent } from './game/game.component';
import { ReviewComponent } from './review/review.component';
import { SpecialEventsComponent } from './special-events/special-events.component';
import { TocComponent } from './toc/toc.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'schedule', component: ScheduleComponent, canActivate: [AuthGuard] },
  {
    path: 'waitlist',
    component: WaitlistComponent,
    canActivate: [AuthGuard],
  },
  { path: 'toc', component: TocComponent, canActivate: [AuthGuard] },
  { path: 'game', component: GameComponent, canActivate: [AuthGuard] },
  { path: 'gallery', component: GalleryComponent, canActivate: [AuthGuard] },
  { path: 'review', component: ReviewComponent, canActivate: [AuthGuard] },
  {
    path: 'special-events',
    component: SpecialEventsComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
