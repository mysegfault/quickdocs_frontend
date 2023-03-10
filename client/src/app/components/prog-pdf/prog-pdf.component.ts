import { Component, OnInit } from '@angular/core';
import { Programs } from 'src/app/models/programs.model';
import { ConnexionService } from 'src/app/services/programs.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-prog-pdf',
  templateUrl: './prog-pdf.component.html',
  styleUrls: ['./prog-pdf.component.scss']
})
export class ProgPDFComponent implements OnInit {

  idList = localStorage.getItem('programID')
  program!: Programs;


  constructor(private _progService: ConnexionService, private _route: Router) { }

  ngOnInit() {

    console.log('idList :', this.idList);

    /** En fonction de l'id du programme récupéré dans le localstorage (transmis de la page des programmes), on récupère toutes les information de ce programme pour les afficher.
     * @param  {} this.idList
     * @param  {Programs} .subscribe((returnProgram
     */
    this._progService.getOneList(this.idList).subscribe((returnProgram: Programs)=>{
      console.log(returnProgram);
      this.program = returnProgram;
      console.log('le programme : ' + this.program);
    })

  }

    /** Cette méthode permet de revenir à la page d'avant (home)*/
    onBackToPrograms() {
      this._route.navigate(['/home/programmes'])
    }


  /** Cette méthode permet de print les pages pour ensuite avoir la possibilité de sauvegarder en PDF */
  onGeneratePdf() {
    window.print();
    // paramêtres de config du print : cf. scss @media print
  }

}