import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-dynamic-survay',
  templateUrl: './dynamic-survay.component.html',
  styleUrls: ['./dynamic-survay.component.scss']
})
export class DynamicSurvayComponent implements OnInit {
  form!: FormGroup;
  question_type: any[] = [
    { name: 'Yes/No', value: 'yes-no' },
    { name: 'Multiple Choice', value: 'multi-choice' }
  ];

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
  }

  /**
   * Khởi tạo Form
   */
  initForm() {
    this.form = this.fb.group({
      questions: this.fb.array([])
    })
  }

  /** 
  * Truy cập Questions trong Form như là 1 biến (nhờ vào phương thức get)
  */
  get questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }

  /**
   * Thêm câu hỏi
   */
  addQuestion() {
    this.questions.push(this.fb.group({
      question_text: ['', Validators.required],
      question_type: [this.question_type[0].value, Validators.required],
      optional: [false],
      answers: this.fb.array([this.fb.group({
        is_correct: [false, Validators.required]
      })])
    }, { validators: [this.multipleChoiceValidator] }));

  }

  /**
   * Xoá câu hỏi
   * @param index 
   */
  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  /**
   * Lấy các câu trả lời của câu hỏi Multiple Choice
   * @param index 
   * @returns 
   */
  getAnswersArr(index: number) {
    return this.questions.at(index).get('answers') as FormArray;
  }

  /**
   * Thêm câu trả lời của câu hỏi Multiple Choice
   * @param index 
   */
  addAnswers(index: number) {
    this.getAnswersArr(index).push(this.fb.group({
      answer_text: ['', Validators.required],
      is_correct: [false]
    }));
  }

  /**
   * Xoá câu trả lời của câu hỏi Multiple Chocie
   * @param index 
   * @param answersIndex 
   */
  removeAnswer(index: number, answersIndex: number) {
    this.getAnswersArr(index).removeAt(answersIndex);
  }

  /**
   * Đáp án YES - NO
   * @param index 
   * @param event 
   */
  changeQuestionResult(index: number, event: any) {
    const value = event.target.value;
    this.getAnswersArr(index).clear();
    this.getAnswersArr(index).push(this.fb.group({
      is_correct: [value, Validators.required]
    }))
  }

  /**
   * Xoá tất cả đáp án
   * @param index 
   */
  clearAnswer(index: number) {
    if (this.questions.at(index).get('question_type')?.value === 'yes-no') {
      this.getAnswersArr(index).push(this.fb.group({
        is_correct: [false, Validators.required]
      }))
    } else {
      this.getAnswersArr(index).clear();
    }
  }

  /**
   * Ràng buộc phải có ít nhất 2 đáp án và 1 lựa chọn đúng trong câu hỏi Multiple Choice
   * @param controls 
   * @returns 
   */
  multipleChoiceValidator(controls: AbstractControl): { [key: string]: boolean } | null {
    const formArr = controls.get('answers') as FormArray;
    const hasMinTwoAnswers = controls.get('question_type')?.value != 'yes-no' ? formArr.length >= 2 : true;
    const hasCorrectAnswer = controls.get('question_type')?.value != 'yes-no' ? formArr.controls.some(control => control.get('is_correct')?.value) : true;
    if (!hasMinTwoAnswers) {
      return { insufficientAnswers: true };
    } if (!hasCorrectAnswer) {
      return { noCorrectAnswer: true };
    }
    return null;
  }

  /**
   * Nhấn nút Submit
   * @returns 
   */
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log(this.form.value);
  }
}
