import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AuthService } from '../../core/auth.service';
import { User } from '../../core/user';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userProfileForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    
  }

  get user(): User {
    return this.authService.currentUser;
  }

  ngOnInit() {
    this.userProfileForm = this.createUserProfileForm(this.authService.currentUser);
  }

  private createUserProfileForm(user: User): FormGroup {
    return this.fb.group({
      name: [],
      description: [],
      cpf: [],
      password: [],
      passConfirmation: []
    });
  }
}
