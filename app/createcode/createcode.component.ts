import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { codeData} from '../models/interfaces.file';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-createcode',
  templateUrl: './createcode.component.html',
  styleUrls: ['./createcode.component.scss']
})
export class CreatecodeComponent implements OnInit {
  listid:any[]=[];
  purchastlist:any[]=[]; 
 constructor(private http:HttpClient,private toastr:ToastrService,private apiservice:ApiService) { }

 ngOnInit(): void {
  this.getallreservedcourses();
 }
 
active(email:any,courseid:any,id:any)
{
  var obj={
    email:email,
    courseid:courseid

  }
  this.apiservice.activecourse(obj).subscribe(res=>{
    
 
    if(JSON.parse(localStorage.getItem("listcourse")||'{}')!=null)
    {
      let newlist=JSON.parse(localStorage.getItem("listcourse")||'{}');
      for(var i=0;i<newlist.length;i++)
      {
        this.listid.push(newlist[i]);
      }
      this.listid.push(res);
      localStorage.setItem("listcourse",JSON.stringify(this.listid));
      this.toastr.success("تم التعيل الكورس")
    }
    else
    {
      this.listid.push(res);
      localStorage.setItem("listcourse",JSON.stringify(this.listid));
      this.toastr.success("تم التعيل الكورس")
    }
  } )

  this.apiservice.deletereserved(id).subscribe(res=>window.location.reload())
}


delete(item:any){
  if(confirm('هل تريد مسح العنصر ؟؟'))
  {
  this.apiservice.deletereserved(item).subscribe({next:data=>{
    this.toastr.success(data.toString())},error:(err)=>{throw new Error(err)}}); 
    window.location.reload();

  }
}

refresh()
{
  this.getallreservedcourses();
}

 getallreservedcourses(){
  this.apiservice.getallreserved().subscribe({next:purch=>{this.purchastlist=purch}
  ,error:(err)=>{throw new Error(err)}});

}


}
