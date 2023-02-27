import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Programs } from 'src/app/models/programs.model';
import { ConnexionService } from 'src/app/services/connexion.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-prog-pdf',
  templateUrl: './prog-pdf.component.html',
  styleUrls: ['./prog-pdf.component.scss']
})
export class ProgPDFComponent implements OnInit {

  idList = localStorage.getItem('iprogramID')
  program!: Programs;


  constructor(private _progService: ConnexionService, private _route: Router) { }

  ngOnInit() {

    console.log('idList :', this.idList);

    this._progService.getOneList(this.idList).subscribe((returnProgram: Programs)=>{
      console.log(returnProgram);
      this.program = returnProgram;
    })

  }

    /** Cette méthode permet de revenir à la page d'avant (home)*/
    onBackToPrograms() {
      this._route.navigate(['/programmes'])
    }


  /** Cette méthode permet de print les pages pour ensuite avoir la possibilité de sauvegarder en PDF */
  onGeneratePdf() {

    window.print();
    // parametres de config du print : cf. scss @media print
  }

}