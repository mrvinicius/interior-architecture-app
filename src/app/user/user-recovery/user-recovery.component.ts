import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'mbx-user-recovery',
  templateUrl: './user-recovery.component.html',
  styleUrls: ['./user-recovery.component.scss']
})
export class UserRecoveryComponent implements OnInit {
  recoveryForm: FormGroup;
  errorMessage: string;


  constructor(
    private auth: AuthService,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {
  }

  recover() {

  }

  private createForm() {
    this.recoveryForm = this.fb.group({
      email: ['', Validators.required]
    });
  }

}
