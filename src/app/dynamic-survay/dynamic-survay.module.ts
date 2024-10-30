import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicSurvayRoutingModule } from './dynamic-survay-routing.module';
import { DynamicSurvayComponent } from './dynamic-survay.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DynamicSurvayComponent
  ],
  imports: [
    CommonModule,
    DynamicSurvayRoutingModule,
    ReactiveFormsModule
  ]
})
export class DynamicSurvayModule { }
