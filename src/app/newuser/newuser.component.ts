import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-newuser',
  templateUrl: './newuser.component.html',
  styleUrls: ['./newuser.component.css']
})
export class NewuserComponent implements OnInit {
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      children: this.fb.array([]) // Initialize FormArray for children
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
    if (this.children.length < 5) { // Limit to a maximum of 5 children
      this.children.push(this.fb.group({
        mname: ['', Validators.required],
        dob: ['', Validators.required],
        age: ['', Validators.required],
        work: ['', Validators.required]
      }));
    }
  }

  removeChild(index: number): void {
    // Allow removing only if there are more than two children
    if (this.children.length > 2) {
      this.children.removeAt(index);
    }
  }

  onSubmit() {
    console.log("sdfsdfsdf");
    if  (!this.userForm.valid)
      {
      console.log("form is invalid");
      return

    }
    console.log(this.userForm.getRawValue());
  }
}
