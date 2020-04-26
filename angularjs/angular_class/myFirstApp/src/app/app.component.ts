import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  name = ["u1","u2","u3"];
  password = ["p1","p2","p3"];
  
  entered_username;
  entered_password;
  message;
  
  constructor()
  {
  }

  submit()
  {
    let i = 0;
    for(i=0;i<this.name.length; i++){
      if(this.name[i] == this.entered_username && this.password[i] == this.entered_password){
        alert("Successful");
        break;
      }
    }
    if(this.name[i] != this.entered_username || this.password[i] != this.entered_password){
      alert("Unsuccessful");
    }
  }

}