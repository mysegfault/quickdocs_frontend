import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Interns } from 'src/app/models/interns.model';
import { Programs } from 'src/app/models/programs.model';
import { ConnexionService } from 'src/app/services/connexion.service';
import { InternsService } from 'src/app/services/interns.service';

@Component({
  selector: 'app-doc-intern',
  templateUrl: './doc-intern.component.html',
  styleUrls: ['./doc-intern.component.scss']
})
export class DocInternComponent implements OnInit {

  verifForm!: FormGroup;
  myControl = new FormControl('');
  intern_code!: Interns;
  titre_programme!: Programs;
  idIntern!: any;
  showMore = false;
  formationSuivie!: Interns;
  allTitlesPrograms!: any;


  constructor(private _fb: FormBuilder, private _insternServ: InternsService, private _programServ: ConnexionService) { }

  ngOnInit(): void {
    // Les attributs, à l'intérieur, servent à lier au html avec formControlName
    // on initialise avec le model User pour ensuite faire appel à object assign.
    this.verifForm = this._fb.group({
      intern_code: ["", Validators.required],
      // titre_programme: ["", Validators.required]
    })

    // On récupère les titres de chaques programmes car on en aura besoin pour comparer au submit.
    this._programServ.getAllLists().subscribe((listsFromBackend: any[]) => {
      console.log(listsFromBackend);
      this.allTitlesPrograms = listsFromBackend;
    })

  }

  /** Cette méthode permet de récupérer les infos de l'utilisateurs puis les infos de la formation, grâce à l'input pour transférer les infos utiles au template à éditer.
   */
  onSubmit() {

    // on fait apparaitre les documents à éditer
    this.showMore = true;

    // On récupère les valeurs du formulaire dans un tableau d'objets
    const form = this.verifForm.value;
    console.log('ici, form : ', form);

    // on stocke les valeurs dont on aura besoin par la suite 
    // const codeIntern = form.intern_code;
    // console.log('codeIntern : ', codeIntern);
    // const programTitle = form.titre_programme;
    // console.log('programTitle : ', programTitle);

    // On récupère les infos à travers le backend :
    this._insternServ.postFindIntern(form).subscribe((resIdIntern: any) => {
      console.log('data recu du backend: ' + resIdIntern)
      this.idIntern = resIdIntern;
      console.log('idIntern :', this.idIntern);
      localStorage.setItem('internID', resIdIntern)

      // puis on récupère le nom de la formation pour le comparer au titre des programmes existant et ainsi réucpérer l'id du programmes qu'on stockera dans le localstorage pour afficher les données dans le template
      this._insternServ.getOnIntern(this.idIntern).subscribe((allDataIntern: any) => {
        console.log('allDataIntern : ', allDataIntern);
        this.formationSuivie = allDataIntern.intern_program;
        console.log("formation suivie : ", this.formationSuivie);

        // on compare : 
        const indexProgram = this.allTitlesPrograms.findIndex((arr: any) => arr[0] === this.formationSuivie);
        console.log(indexProgram);
        // on stocke :
        localStorage.setItem('programIDwithStagiaire', indexProgram)
      })

    })



  }


}
