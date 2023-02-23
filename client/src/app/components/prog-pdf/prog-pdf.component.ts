import { Component, OnInit } from '@angular/core';
import { Programs } from 'src/app/models/programs.model';
import { ConnexionService } from 'src/app/services/connexion.service';

@Component({
  selector: 'app-prog-pdf',
  templateUrl: './prog-pdf.component.html',
  styleUrls: ['./prog-pdf.component.scss']
})
export class ProgPDFComponent implements OnInit {

  idList = localStorage.getItem('iprogramID')
  program!: Programs;

  constructor(private _progService: ConnexionService) { }

  ngOnInit() {

    console.log('idList :', this.idList);

    this._progService.getOneList(this.idList).subscribe((returnProgram: Programs)=>{
      console.log(returnProgram);
      this.program = returnProgram;
    })

  }




  /** Cette méthode permet de générer le PDF à partir du HTML*/
  onGeneratePdf() {

  }

}
