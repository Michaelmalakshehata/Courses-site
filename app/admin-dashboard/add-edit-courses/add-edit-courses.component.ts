import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ICoursesDetails, IData } from 'src/app/models/classes';
import { ApiService } from 'src/app/services/api.service';
import { CoursesapiService } from 'src/app/services/coursesapi.service';

@Component({
  selector: 'app-add-edit-courses',
  templateUrl: './add-edit-courses.component.html',
  styleUrls: ['./add-edit-courses.component.scss']
})
export class AddEditCoursesComponent implements OnInit {

 @Input() course:any;
 @Output() ActivateAddEditcrsComp:EventEmitter<boolean>=new EventEmitter();
 Courses_Detailesidlist:any[]=[{}];
 ActivateAddEditcrsC:boolean=true;
 
 res:IData[]=[];
 now=new Date();
 form!:FormGroup
  submitted = false;
  isSet = false;
  exist:boolean=false;
  errorexist:boolean=false;
  coursesList:any[]=[];
 constructor(private formBuilder: FormBuilder,private service:CoursesapiService,private sendbroadcast:ApiService,private toastr:ToastrService) { }


 ngOnInit(): void {
  this.service.getAllCourses().subscribe({next:(res: ICoursesDetails[])=>{this.coursesList=res},
  error:(err)=>{throw new Error(err)}} );

  this.form = this.formBuilder.group(
    {
      
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
         
        ],
      ],
      price: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?![0]$)\d{1,10}$/),
         
        ],
      ],
      discount: [
        '',
        [
          Validators.pattern(/^\d{0,2}$/)
         
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
         
        ],
      ],
      numberofvideos: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?![0]$)\d{1,10}$/),
         
        ],
      ],
      numberofhours: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?![0]$)\d{1,10}$/),
         
        ],
      ],

      imgpath:[
        '',
        [
          Validators.required
        ],
      ]

    }
  );
 }

 get f(): { [key: string]: AbstractControl } {
  return this.form.controls;
}
 onSubmit(): void {
  this.exist=this.coursesList.some(element=> element.name===this.course.name);
  this.submitted = true;
  this.isSet = true;
  if (this.form.invalid ) {
    return;
    
     }
     else if(this.exist==true)
     {
      this.errorexist=true;
         return;
     }
else{
  this.errorexist=false;
   if(this.course.id ==0){
     var val1={
       "name": this.course.name,
       "imgpath": this.course.imgpath,
       "price": this.course.price,
       "discount": this.course.discount,
       "description": this.course.description,
       "numberofvideos": this.course.numberofvideos,
       "numberofhours": this.course.numberofhours,
       "date":this.now.toLocaleDateString()      
       }
       this.service.AddCourse(val1).subscribe({next:res=>this.toastr.success("تم اضافه الكورس  بنجاح"), 
       error:(err)=>{throw new Error(err)}});
      var emalsend={subject:"تم أضافه كورس جديد",body:this.course.name}
      this.sendbroadcast.sendbroadcast(emalsend).subscribe({next:res=>this.toastr.success("تم ارسال اشعار اضافه كورس الى جميع المشتركين بنجاح"),
      error:(err)=>{throw new Error(err)}});     }
   else{
     this.EditCourse(this.course);
    }
  }
     this.sendData();
 }

 EditCourse(dataitem:ICoursesDetails){
   this.course = dataitem;
   this.service.UpdateCourse(this.course.id,this.course).subscribe({next:res=>this.toastr.success("تم التعديل بنجاح"), 
   error:(err)=>{throw new Error(err)}   })      
 }

 uploadPhoto(event:any){
   var file=event.target.files[0];
   const formData:FormData=new FormData();
   formData.append('files',file);

   this.service.UploadPhoto(formData).subscribe({next:(data)=>{
     
     this.res=data as IData[]; 
     
     if (this.res.length>0){
       this.course.imgpath = this.res[0].name;
     

     }
   }, error:(err)=>{throw new Error(err)}});
 }

 sendData(){
   this.ActivateAddEditcrsComp.emit(this.ActivateAddEditcrsC);
   
 }
}
