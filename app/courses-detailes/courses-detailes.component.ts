import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CoursesapiService } from 'src/app/services/coursesapi.service';
import { ApiService } from '../services/api.service';
import { SharedserviceService } from '../services/sharedservice.service';
import { videodata } from 'src/app/models/interfaces.file';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ICoursesDetails, ICourses_category } from '../models/classes';
import {Location} from '@angular/common';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-courses-detailes',
  templateUrl: './courses-detailes.component.html',
  styleUrls: ['./courses-detailes.component.scss']
})
export class CoursesDetailesComponent implements OnInit {

 
constructor(private rout:ActivatedRoute,private _location: Location ,private service:CoursesapiService , private router:Router,private apiservice:ApiService,private sharedservice:SharedserviceService,private http:HttpClient,private toastr:ToastrService) { }
c:boolean=false;
//code activation
islogged:boolean=false;
id:any;
purchastlist:any[]=[];
exist:boolean=false;
errorexist:boolean=false;
listid:any[]=[];
/////////////////////
course:ICoursesDetails={
  id:0,
  name:"",
  imgpath:"",
  price:0,
  discount:0,
  description:"",
  numberofvideos:0,
  numberofhours:0,
  date:"",
};
videoList:videodata[]=[];
categories:ICourses_category[]=[];
cat:any;
selectedList:videodata[]=[]
videos:videodata[]=[]; 
v:videodata={
  id:0,
  name:"",
  description:"",
  videopath:"",
  courses_Categoryid:0
};
tests:any[]=[];
path:string|undefined;
video:videodata[]=[];
  ngOnInit(): void {
this.rout.paramMap.subscribe({next:(pramas:ParamMap)=>{this.id=pramas.get("id");}
,error:(err)=>{throw new Error(err)}})
this.service.getCourseByid(this.id).subscribe({next:data =>{this.course=data},
  error:(err)=>{throw new Error(err)}})
this.getfirstvideo();
this.getallreservedcourses();
let coursecode =JSON.parse(localStorage.getItem("listcourse")||'{}');
if(coursecode!=null){
  for(var i=0;i<coursecode.length;i++)
  {
          
    if(coursecode[i]==this.id)
    {
      this.c=true;
      this.apiservice.GetCatBYFK(this.id).subscribe({next:cats => {this.categories }
      ,error:(err)=>{throw new Error(err)}})
      break;
    }
  }
}
if(sessionStorage.getItem("Role")=='Admin')
{
      this.c=true;
      this.apiservice.GetCatBYFK(this.id).subscribe({next:cats => {this.categories }
      ,error:(err)=>{throw new Error(err)}})
}

///code activation

  }

  
    checkLogin(){
      if (localStorage.getItem("jwt")!=null) {
        var headers=new HttpHeaders().set
          ("Authorization", `Bearer ${localStorage.getItem("jwt")}`)
        this.http.get("http://localhost:29069/api/registration/Auth",{headers,responseType:"text"}).
        subscribe({next:data=>{sessionStorage.setItem("Email",JSON.parse(data)[0])
        sessionStorage.setItem("Username", JSON.parse(data)[1]),
        this.islogged=true},error:(err)=>{throw new Error(err)}}
        )
      }

  }
Activatecourse(){
  this.exist=this.purchastlist.some(element=> element.name===this.course.name);
  let logedemail=sessionStorage.getItem("Email")
  let username=sessionStorage.getItem("Username")
  let price=this.course.price-((this.course.discount/100)*this.course.price)
  if(this.exist==false)
  {
    var val1={
      email:logedemail,
      username:username,
      courseid:this.id,
      name:this.course.name,
      finalprice:price
    }
    
    this.apiservice.addreservedcourse(val1).subscribe({next:res=>{this.toastr.success(res.toString());
  window.location.reload()},error:(err)=>{throw new Error(err)}});
  }
  else{
    this.errorexist=true;
  }
 
 
  
  
}
/////////////////////////

  getvideodetailes (id:any){
    this.router.navigate([`coursedetailes/${this.id}/${id}`])
  }
  getfirstvideo()
  {
    this.apiservice.GetCatBYFK(this.id).subscribe({next:cats => {this.categories =cats
      this.cat=this.categories[0]
      this.sharedservice.GetVideoBYFK(this.cat.id).subscribe(data =>{this.video=data
     
      })
    },error:(err)=>{throw new Error(err)}})
    


  }
  getallreservedcourses(){
    this.apiservice.getallreserved().subscribe({next:purch=>{this.purchastlist=purch}
    ,error:(err)=>{throw new Error(err)}});

  }

  backClicked() {
    this._location.back();
  }
  
}
