import { Component, NgZone, OnInit } from '@angular/core';
import { User } from '../model/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  user = new User();
  username: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private appService: AppService
  )
  {
    this.mainForm();
    this.getUser();
  }

  get myForm() {
    return this.createForm.controls;
  }

  submitted = false;
  createForm: FormGroup;

  ngOnInit(): void {
  }

  mainForm() {
    this.createForm = this.formBuilder.group({
      tractorName: ['', [Validators.required]],
      tractorYear: ['', [Validators.required, Validators.pattern('^[-+]?[0-9]+(\\.[0-9]+)?$'), Validators.min(1)]],
      tractorWeight: ['', [Validators.required, Validators.pattern('^[-+]?[0-9]+(\\.[0-9]+)?$'),Validators.min(1)]]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (!this.createForm.valid) {
      alert('Nem megfelelőek az adatok! Minden mezőt ki kell tölteni, a traktor évjárata és súlya szám lehet csak illetve 1-től nagyobb!!');
      return false;
    } else {
      this.appService.createTractor(this.createForm.value).subscribe(
        (res) => {
          alert('Sikeres hozzáadás.');
          this.ngZone.run(() => this.router.navigateByUrl('/list'));
        }, (error) => {
          alert('Hiba' + error);
        });
    }
  }

  getUser() {
    if (this.appService.getLoggedInUser().uname == null) {
      this.router.navigate(['/login']);
    }

    this.user = this.appService.getLoggedInUser();
    this.username = JSON.stringify(this.user.uname);
  }

  logout(){
    this.user = new User();
    this.appService.setLoggedInUser(this.user);
    this.router.navigate(['/login']);
  }
}
