import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../services/api.service';
import { SharedserviceService } from '../services/sharedservice.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  form!:FormGroup;

email:string="";
submitted:boolean=false;
  isSet:boolean=false ;
errorexist:boolean=false;
exist:boolean=false;
resgiterlist:any[]=[];
correctcode:string="";
code:string="";
codeerror:boolean=false;
password:string="";


emailform:boolean=true;
codeform:boolean=false;
passwordform:boolean=false;
  constructor(private formBuilder: FormBuilder,private service:SharedserviceService,private sendmail:ApiService,private toastr:ToastrService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
      });
      
      this.getallregister();
  }




  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  
  onSubmit()
  {
    this.submitted = true;
    this.isSet = true;
    this.exist=this.resgiterlist.some(element=> element.email===this.email);

    if (this.form.invalid ) {
      return;
      
       }
       else if(this.exist==false)
       {
        this.errorexist=true;
           return;
       }
       else{
        this.correctcode=String(Math.floor(100000+Math.random()*900000));
        var val={mailto:this.email,subject:"كود التحقق",code:this.correctcode};
        this.sendmail.sendemailcode(val).subscribe({next:res=>{this.toastr.success("تم ارسال كود التحقق بنجاح");
      this.emailform=false;
      this.codeform=true;
    },error:(err)=>{throw new Error(err)}});
  
  }
  }
 
  activeform()
  {
    this.codeerror=false;
 
    if(this.correctcode==this.code){
      
      this.emailform=false;
      this.codeform=false;
      this.passwordform=true;
        
    }  
    else{
  this.codeerror=true;
    }  
   
  }
  onsubmit(){
    var objupdate={
      password:this.password,
      email:this.email
    };
    this.service.updatepassword(objupdate).subscribe({next:res=>this.toastr.success("تم تحديث كلمه المرور بنجاح")
  ,error:(err)=>{throw new Error(err)}});
       

  }
  getallregister(){
    this.service.Getallregister().subscribe({next:data=>{this.resgiterlist=data},
      error:(err)=>{throw new Error(err)}});

  }
}
