import { Component, OnInit } from '@angular/core';
import { ConnexionService } from 'src/app/services/connexion.service';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit {

  allList!: any[];

  constructor( private _programServ: ConnexionService ) { }
 
  ngOnInit() {
    this._programServ.getAllLists().subscribe((listsFromBackend: any[])=>{
      console.log(listsFromBackend);
      this.allList = listsFromBackend
    })
  }



}
