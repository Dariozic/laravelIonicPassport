import { HomePage } from './../home/home.page';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, AlertController } from '@ionic/angular';
import { HomePageModule } from '../home/home.module';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

    private activeForm: string;
    private loginForm: any;
    private registerForm: any;
    private loading: any;

    constructor(private authService: AuthService, 
        private loadingCtrl: LoadingController, 
        private alertCtrl: AlertController, 
        public navCtrl: NavController
        ) {
            this.activeForm = 'login';
            this.loginForm = {
                'email':'',
                'password': ''
            }
            this.registerForm = {
                'name':'',
                'email':'',
                'password': ''
            }
            this.loading = loadingCtrl.create({ message: 'Waiting...' });
    }

  ngOnInit() {
  }

  async checkAuthenticated () 
  {
    try {
      let isAuthenticated = await this.authService.checkIsAuthenticated();
      if ( isAuthenticated ) {
        // this.menuCtrl.enable(true);
        //this.navCtrl.HomePage();
      }
    } catch (err) {
      console.log(err);
      let alert = this.alertCtrl.create({ header: 'Error', message: 'Error on verify authentication info', buttons: ['Ok'] });
      //alert.present();
    }
  }

  private doLogin(form: any) {
    this.authService.login(form).subscribe(
        res => {
            console.log(res);
            //this.loading.dismiss();
            this.authService.storeCredentials(res);
            // setTimeout(() => {
            //     this.checkAuthenticated()
            // }, 750);
        },
        err => {
            console.log(err);
            let alert = this.alertCtrl.create({
                header: 'Error',
                message: "Can't login.",
                buttons: ['OK']
            });
        }
    );
}

  private doRegister() {
        this.authService.register(this.registerForm).subscribe(
            res => {
                console.log(res);
                this.doLogin({
                    email: this.registerForm.email,
                    password: this.registerForm.password,
                });
            },
            err => {
                console.log(err);
                let alert = this.alertCtrl.create({
                    header: 'Error',
                    message: "Can't register.",
                    buttons: ['OK']
                });
            }
        );
  }

}
