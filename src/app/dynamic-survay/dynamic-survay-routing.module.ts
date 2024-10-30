import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicSurvayComponent } from './dynamic-survay.component';

const routes: Routes = [{ path: '', component: DynamicSurvayComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicSurvayRoutingModule { }
