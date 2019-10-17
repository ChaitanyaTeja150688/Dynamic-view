import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    roles = [
        { code: 'admin', value: 'Adminstrator' },
        { code: 'user', value: 'user' },
    ];
    loginForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private userDataService: UserDataService
    ) { }

    ngOnInit() {
        this.buildFormControls();
        // this.testQuestions();
    }

    testQuestions() {
        // ===> 1
        // pharse = 'hello';
        // if (false) {
        //     var pharse;
        // }
        // console.log(pharse);
        // end
        // ===> 2
        // console.log('foo');
        // setTimeout(g, 0);
        // console.log('baz');
        // h();
        // end
        // ===> 3
        // const hey = 'hey';
        // const you = 'you';
        // const heyyou = hey + you + '';
        // ['h', 'e', 'y'].forEach((letter) => console.log(letter));
        // // end
        // // ===> 4
        // console.log(console.log, console.log( console.log( ((tr) => 10) )));
        // // end
        // // ===> 5
        // function header(header) {
        //     function innerFunction(innerFunction) {
        //         return header(innerFunction);
        //     }
        //     return innerFunction;
        // }
        // console.log(header(12)(12));
        // end
    }

    // function g() {
    //     console.log('bar');
    // }

    // function h() {
    //     console.log('blix');
    // }

    buildFormControls() {
        this.loginForm = this.formBuilder.group({
            userName: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required]),
            role: new FormControl('')
        });
    }

    onChange(role) {
        this.loginForm.get('role').setValue(role);
    }

    login() {
        this.userDataService.getMetaDataList();
        this.userDataService.getMetaDataList();
        const role = this.loginForm.get('role');
        if (role.value === 'admin') {
            this.router.navigate(['view-list']);
        } else {
            this.router.navigate(['user-list']);
        }
    }

    disable() {
        const role = this.loginForm.get('role');
        return (this.loginForm.valid && role.value);
    }
}
