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
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      children: this.fb.array([]),
    });

    // Add two children by default
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
    this.userData.push(this.userForm.getRawValue());
    this.userForm.reset();
    console.log('Form submitted');
    console.log(this.userData);
  }
}
