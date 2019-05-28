import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule',
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardPageModule'},
  { path: 'level', loadChildren: './level/level.module#LevelPageModule',  },
  { path: 'course/:id', loadChildren: './course/course.module#CoursePageModule',  },
  { path: 'question/:id/:name', loadChildren: './question/question.module#QuestionPageModule',  },
  { path: 'test', loadChildren: './test/test.module#TestPageModule',  },
  { path: 'challenge', loadChildren: './challenge/challenge.module#ChallengePageModule', },
  { path: 'update', loadChildren: './update/update.module#UpdatePageModule' },
  { path: 'scoreboard', loadChildren: './scoreboard/scoreboard.module#ScoreboardPageModule' },
  { path: 'result', loadChildren: './result/result.module#ResultPageModule' },
  { path: 'feedback-modal', loadChildren: './feedback-modal/feedback-modal.module#FeedbackModalPageModule' },
  { path: 'help', loadChildren: './help/help.module#HelpPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
