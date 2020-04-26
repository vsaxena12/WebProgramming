import { Component, OnInit } from '@angular/core';
import { ConnectionService } from 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  constructor(private connection:ConnectionService)
  {

  }
  submit()
  {
  var credntials=this.connection.getcredentials();//holds array objects
  let errormessage=false
  var status=credentials.find((data)=>
  {
  if(data.username=this.entered_username && data.password=entered_password)
  {
  alert("Successfull");
  this.errormessage=false;
  return true;
  }
  });
  if(!staus)
  {
  this.errormessage=true;
  }
          //console.log(this.connection.getcredentials)
          





  // name = ["u1","u2","u3"];
  // password = ["p1","p2","p3"];
  
  // entered_username;
  // entered_password;
  // message;
  
  // constructor()
  // {
  // }

  // submit()
  // {
  //   let i = 0;
  //   for(i=0;i<this.name.length; i++){
  //     if(this.name[i] == this.entered_username && this.password[i] == this.entered_password){
  //       alert("Successful");
  //       break;
  //     }
  //   }
  //   if(this.name[i] != this.entered_username || this.password[i] != this.entered_password){
  //     alert("Unsuccessful");
  //   }
  // }
  
  // ngOnInit() {
    
  // }

}
