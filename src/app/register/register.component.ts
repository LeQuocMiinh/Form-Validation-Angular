import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [DatePipe]
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  emptyFields: any[] = [];
  @ViewChild('formContainer') formContainer!: ElementRef;
  checkboxReceive: boolean = false;
  toast: any = {
    icon: 'bi bi-exclamation-circle',
    status: 'Lỗi',
    color: '#ff0000',
    message: 'nothing!'
  };
  regionPhone: any[] = [
    { code: '+12', region: 'Canada' },
    { code: '+84', region: 'Vietname' },
    { code: '+13', region: 'Australia' },
    { code: '+15', region: 'Russia' },
  ];
  contactMethod: any[] = [
    { value: 'email', name: 'Email' },
    { value: 'sms', name: 'SMS' },
    { value: 'email+sms', name: 'Both' },
  ];
  hearAboutUs: any[] = [
    { value: 'social-media', name: 'Social Media' },
    { value: 'friend-family', name: 'Friend/Family' },
    { value: 'online-advertisement', name: 'Online Advertisement' },
    { value: 'Other', name: 'Other' },
  ];
  regionSelected: string = this.regionPhone[0].code;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.initForm();
  }

  /**
   * Khởi tạo Form
   */
  initForm() {
    this.form = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', [Validators.required, Validators.minLength(8)]],
      checkbox: [false],
      additionalFields: this.fb.array([])
    }, { validators: [this.matchPasswordValidator, this.dateOfBirthValidator] });
  }

  get additionalFields(): FormArray {
    return this.form.get('additionalFields') as FormArray;
  }

  /**
   * Thêm các trường dữ liệu vào formArray khi checked nhận ưu đãi
   */
  addFieldsToForm() {
    this.checkboxReceive = !this.checkboxReceive;
    if (this.checkboxReceive) {
      this.additionalFields.push(this.fb.group({
        prefer_contact_method: [this.contactMethod[0].value, Validators.required],
        street_address: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        postal_code: ['', Validators.required],
        country: ['', Validators.required],
        hear_about_us: [this.hearAboutUs[0].value, Validators.required],
      }));
    } else {
      this.additionalFields.clear();
    }
  }

  /**
   * Nhấn đăng ký
   */
  submitForm() {
    this.emptyFields = this.checkFieldsInvalid().filter(e => e != '');
    if (this.emptyFields.length > 0 && this.emptyFields) {
      this.validatedInputFields(this.emptyFields);
    } else {
      this.showMessage('success', 'OK, Lets go babie');
      sessionStorage.setItem('user', JSON.stringify(this.form.value));
      setTimeout(() => {
        this.router.navigate(['/todo-list']);
      }, 1000);
    }
  }

  /**
   * Kiểm tra các trường dữ liệu
   * @returns 
   */
  checkFieldsInvalid() {
    const valueForm = this.form.controls || {};
    let valueAdditionalForm = {}

    if (this.additionalFields && this.additionalFields.length > 0) {
      const firstControl = this.additionalFields.at(0); // Sử dụng at(n) để truy cập vào phần tử n của mảng
      if (firstControl instanceof FormGroup) { // Kiểm tra nếu phần tử đầu tiên là một FormGroup
        valueAdditionalForm = firstControl.controls; // Nếu là FormGroup thì có thể truy cập biến controls
      }
    }

    if (this.form.value.phone_number != '') {
      this.form.value.phone_number = `${this.regionSelected}${this.form.value.phone_number.toString().slice(0)}`;
    }

    const fieldsInvalid = Object.entries(valueForm)
      .filter(([_, value]) => value.status === 'INVALID')
      .map(([key]) => key);
    const additionalFieldsEmpty = Object.entries(valueAdditionalForm)
      .filter(([_, value]: any) => value.status === 'INVALID')
      .map(([key]) => key);

    const confirm_password = this.form.errors?.['passwordsDoNotMatch'] ? 'confirm_password' : '';
    const date_of_birth = this.form.errors?.['notOldEnough'] ? 'date_of_birth' : '';
    const summary = [...additionalFieldsEmpty, ...fieldsInvalid, confirm_password, date_of_birth];

    return [...new Set(summary)];
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

  /**
   * Chọn khu vực điện thoại
   * @param event 
   */
  onSelect(event: any) {
    this.regionSelected = event.target.value;
  }

  /**
   * Hàm kiểm tra nhập lại mật khẩu
   * @param control 
   * @returns 
   */
  matchPasswordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirm_password')?.value;
    return password === confirmPassword ? null : { passwordsDoNotMatch: true };
  }

  /**
   * Hàm kiểm tra tuổi
   * @param control 
   * @returns 
   */
  dateOfBirthValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const birthdate = new Date(control.get('date_of_birth')?.value);
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDifference = today.getMonth() - birthdate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }
    return (age > 18 && age < 150) ? null : { notOldEnough: true };
  }

}
