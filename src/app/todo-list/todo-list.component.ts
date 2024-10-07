import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent {
  form!: FormGroup;
  emptyFields: any;
  listTodo: any[] = [];
  @ViewChild('formContainer') formContainer!: ElementRef;
  categoryOptions: any[] = [
    { value: 'shopping', name: 'Shopping' },
    { value: 'work', name: 'Work' },
    { value: 'dating', name: 'Dating' },
    { value: 'entertainment', name: 'Entertainment' },
  ];
  toast: any = {
    icon: 'bi bi-exclamation-circle',
    status: 'Lỗi',
    color: '#ff0000',
    message: 'nothing!'
  };
  statusList: any[] = [
    { value: 'incompleted' },
    { value: 'completed' }
  ];

  constructor(
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    const data = localStorage.getItem('todo-list');
    this.listTodo = data ? JSON.parse(data) : [];
  }

  /**
   * Khởi tạo Form
   */
  initForm() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      due_date: ['', Validators.required],
      category: [this.categoryOptions[0].value, Validators.required],
      status: [this.statusList[0].value]
    }, { validators: this.validateDueDate })
  }

  /**
   * Nhấn tạo 
   */
  submit() {
    this.emptyFields = this.checkFieldsInvalid().filter(e => e != '');
    if (this.emptyFields.length > 0 && this.emptyFields) {
      this.validatedInputFields(this.emptyFields);
    } else {
      const existsTodo: any = localStorage.getItem('todo-list') ? localStorage.getItem('todo-list') : [];
      const todoList = existsTodo.length == 0 ? [] : JSON.parse(existsTodo);
      todoList.push(this.form.value);
      const newTodoList = todoList.filter((item: any, index: number, self: any[]) => {
        return index === self.findIndex((e: any) => e.title === item.title);
      });
      this.listTodo = newTodoList;
      localStorage.setItem('todo-list', JSON.stringify(newTodoList));
      this.form.reset();
    }
  }


  /**
   * Kiểm tra các trường dữ liệu
   * @returns 
   */
  checkFieldsInvalid() {
    const valueForm = this.form.controls || {};
    const fieldsInvalid = Object.entries(valueForm)
      .filter(([_, value]) => value.status === 'INVALID')
      .map(([key]) => key);

    const due_date = this.form.errors?.['notDateEnough'] ? 'due_date' : '';
    const summary = [...fieldsInvalid, due_date];

    return [...new Set(summary)];
  }

  /**
  * Lấy các element theo mảng
  * @param arr 
  * @returns 
  */
  getElementsArray(arr: Array<string>): HTMLElement[] {
    const arrs: HTMLElement[] = [];
    arr.forEach((select: string) => {
      const found = this.formContainer.nativeElement.querySelector(`[name="${select}"]`);
      if (found) {
        arrs.push(found);
      }
    });
    return arrs;
  }

  /**
  * Hiển thị thông báo
  * @param type 
  * @param message 
  */
  showMessage(type: 'error' | 'success' | 'info', message: string) {
    const toastLiveExample = document.getElementById('liveToast');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);

    const icons = {
      error: 'bi bi-exclamation-circle',
      success: 'bi bi-check-circle',
      info: 'bi bi-question-circle'
    };
    const status = {
      error: 'ERROR',
      success: 'SUCCESS',
      info: 'WAITING'
    };
    const colors = {
      error: '#ff0000',
      success: '#33cc33',
      info: '#0066ff'
    }
    toastBootstrap.show();

    this.toast = {
      icon: icons[type],
      status: status[type],
      color: colors[type],
      message: message
    };
  }

  /**
    * Thêm hiệu ứng cho các trường không hợp lệ
    * @param arr 
    */
  validatedInputFields(arr: any[]) {
    this.showMessage('error', 'You should fill fields!');
    this.getElementsArray(arr).map((item: any) => {
      item.classList.add('is-invalid');
      item.addEventListener('input', () => {
        item.classList.remove('is-invalid');
      })
    });
  }

  validateDueDate(control: AbstractControl): { [key: string]: boolean } | null {
    const now = new Date();
    const due_date = new Date(control.get('due_date')?.value);

    // Chuẩn hoá thời gian lại, chỉ so sánh ngày
    now.setHours(0, 0, 0, 0);
    due_date.setHours(0, 0, 0, 0);

    const result = due_date.valueOf() - now.valueOf();
    return result >= 0 ? null : { notDateEnough: true }
  }

  updateStatus(i: number, status: string) {
    const reserveStatus = this.statusList.map(e => { return e.value != status ? e : null }).filter(i => i != null).at(0);
    this.listTodo.find((value: any, index: number, obj: any) => {
      if (index === i) {
        value.status = reserveStatus.value;
      }
    });
    localStorage.setItem('todo-list', JSON.stringify(this.listTodo));
  }
}
