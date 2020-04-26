import { Component } from '@angular/core';
//import { setInterval } from 'timers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  u;
  p;
  
  constructor(){

  }

  onClick(){
    let username = ["test1","test2","test3"];
    let password = ["test1","test2","test3"];
    if(this.u == username[0] && this.p == password[0]){
      alert("Login Successful");
    }
    else if(this.u == username[1] && this.p == password[1]){
      alert("Login Successful");
    }
    else if(this.u == username[2] && this.p == password[2]){
      alert("Login Successful");
    }
    else{
      alert("Login Fail");
    }

  //this.click();



  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  /* num = 10;
  constructor(){
    
    //var is function scope
    //let is block scope
    //const cannot be accessed outside the block and will be constant that is value will not chaneg
    console.log(this.num);
  } */
  
  
  // title = 'my-dream-app';

  // timer;
  // i = 0;
  // constructor(){
  //   var test = () => {
  //     console.log("Hello Angular");
  //   }
  //   //test();
  //   // this.timer = setInterval(() =>{
  //   //     console.log(this.i);
  //   //     this.i++;
  //   //     if(this.i < 5)
  //   //     {
  //   //       clearInterval(this.timer);
  //   //     }
  //   // }, 2000)

  //   // this.timer = setTimeout(() => {
  //   //   console.log("Hello ");
  //   // }, 5000)

  // }
}
