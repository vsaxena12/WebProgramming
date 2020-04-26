Template Form:

1. Home component -> create form in home.componetn.html from copying code from login.component.html
2. run ng serve
3. Remove ngModel 
4. Template driven form
5. <form #userForm="ngForm" (ngSubmit)="onSubmit(userForm.value)"> // reference variable
6. name="email"; name="name"; etc
7. Mention ngModel
8. Save it and put {{userForm.value | json}} before form tag closes
9. In input tag put #name for the reference variable
10. Button type="submit"



home.component.js:
onSubmit(value){
	console.log(value);
}

http://buzzedcode.com/angular-7-and-asp-net-core-2-2-crud/
