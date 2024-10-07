import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoListRoutingModule } from './todo-list-routing.module';
import { TodoListComponent } from './todo-list.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TodoListComponent
  ],
  imports: [
    CommonModule,
    TodoListRoutingModule,
    ReactiveFormsModule
  ]
})
export class TodoListModule { }
