import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-newuser',
  templateUrl: './newuser.component.html',
  styleUrls: ['./newuser.component.css'],
})
export class NewuserComponent implements OnInit {
  userForm: FormGroup;
  userData: any = [];
  isViewVisible = false;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z ]+$'),
          Validators.maxLength(45),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z ]+$'),
          Validators.maxLength(45),
        ],
      ],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required]],
      children: this.fb.array([]),
    });

    this.addChild();
    this.addChild();
  }

  ngOnInit(): void {}

  get children(): FormArray {
    return this.userForm.get('children') as FormArray;
  }

  addChild(): void {
    if (this.children.length < 5) {
      const childForm = this.fb.group({
        mname: ['', Validators.required],
        dob: ['', Validators.required],
        age: [{ value: '', disabled: true }, Validators.required],
        work: ['', Validators.required],
      });

      childForm.get('dob')?.valueChanges.subscribe((dob) => {
        if (dob) {
          const age = this.calculateAge(dob);
          childForm.get('age')?.setValue(age.toString());
        }
      });

      this.children.push(childForm);
    }
  }

  removeChild(index: number): void {
    if (this.children.length > 2) {
      this.children.removeAt(index);
    }
  }

  preventNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (charCode >= 48 && charCode <= 57) {
      event.preventDefault();
    }
  }

  preventTyping(event: KeyboardEvent): void {
    event.preventDefault();
  }
  onDateInput(event: Event): void {}

  preventAlpha(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  calculateAge(dob: string): number {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  toggleView() {
    this.isViewVisible = !this.isViewVisible;
  }

  onSubmit() {
    if (!this.userForm.valid) {
      console.log('Form is invalid');
      return;
    }

    const submittedData = this.userForm.getRawValue();

    this.userData.push(submittedData);

    const childrenArray = this.userForm.get('children') as FormArray;
    if (childrenArray.length > 2) {
      const firstTwoChildren = childrenArray.controls.slice(0, 2);
      childrenArray.clear();
      firstTwoChildren.forEach((child) => childrenArray.push(child));
    }

    this.userForm.reset();

    console.log('Form submitted');
    console.log(this.userData);
  }
}
