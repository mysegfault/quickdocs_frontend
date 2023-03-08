import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Interns } from 'src/app/models/interns.model';
import { ConnexionService } from 'src/app/services/connexion.service';
import { InternsService } from 'src/app/services/interns.service';
import { map, Observable, startWith } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmAddInternModalComponent } from 'src/app/modals/confirm-add-intern-modal/confirm-add-intern-modal.component';
import { Router } from '@angular/router';

const moment = require('moment');

@Component({
  selector: 'app-add-intern',
  templateUrl: './add-intern.component.html',
  styleUrls: ['./add-intern.component.scss']
})
export class AddInternComponent implements OnInit {

  internForm!: FormGroup;
  myControl = new FormControl('');
  interns = new Interns();
  intern_code!: Interns;
  intern_genre!: Interns;
  intern_lastname!: Interns;
  intern_firstname!: Interns;
  intern_adress!: Interns;
  intern_zipcode!: Interns;
  intern_city!: Interns;
  intern_program!: Interns;
  program_duration?: Interns;
  module_format?: Interns;
  intern_firstdate!: Interns;
  intern_lastdate!: Interns;
  intern_duration!: Interns;
  intern_achievement!: Interns;
  intern_finance!: Interns;
  number_convention?: Interns;
  module_number?: Interns;
  program_format?: Interns;
  number_intern?: Interns;
  training_cost?: Interns;
  learning_cost?: Interns;
  total_cost?: Interns;
  deposit?: Interns;
  convention_date?: Interns;
  first_training_date?: Interns;
  allTitlesPrograms!: any[];
  titles!: string[];
  filteredTitles!: Observable<string[]>;
  

  constructor(private _fb: FormBuilder, private _insternServ: InternsService, private _snackBar: MatSnackBar, private _programServ: ConnexionService, private _matDialog: MatDialog, private _route: Router) { }

  ngOnInit(): void {
    // Les attributs, à l'intérieur, servent à lier au html avec formControlName
    // on initialise avec le model Interns pour ensuite faire appel à object assign.
    this.internForm = this._fb.group({
      intern_code: [this.interns.intern_code, Validators.required],
      intern_genre: this.interns.intern_genre,
      intern_lastname: [this.interns.intern_lastname, Validators.required],
      intern_firstname: [this.interns.intern_firstname, Validators.required],
      intern_adress: this.interns.intern_adress,
      intern_zipcode: this.interns.intern_zipcode,
      intern_city: this.interns.intern_city,
      intern_program: [this.interns.intern_program, Validators.required],
      program_duration: this.interns.program_duration,
      module_format: this.interns.module_format,
      intern_firstdate: this.interns.intern_firstdate,
      intern_lastdate: this.interns.intern_lastdate,
      intern_duration: this.interns.intern_duration,
      intern_achievement: this.interns.intern_achievement,
      intern_finance: this.interns.intern_finance,
      number_convention: this.interns.number_convention,
      module_number: this.interns.module_number,
      program_format: this.interns.program_format,
      number_intern: this.interns.number_intern,
      training_cost: this.interns.training_cost,
      learning_cost: this.interns.learning_cost,
      total_cost: this.interns.total_cost,
      deposit: this.interns.deposit,
      convention_date: this.interns.convention_date,
      first_training_date: this.interns.first_training_date,
    })

    // On récupère les titres de chaques programmes car on en a besoin pour le champs du nom de la formation suivie.
    this._programServ.getAllLists().subscribe((listsFromBackend: any[]) => {
      console.log('tableau des titres :', listsFromBackend);
      this.allTitlesPrograms = listsFromBackend;
      this.titles = this.allTitlesPrograms.map(arr => arr[0])
      // @ts-ignore
      this.filteredTitles = this.internForm?.get("intern_program")?.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      );
    })

  }
  /** Cette méthode permet de récupérer la valeur de tous les champs pour l'ajouter en BDD.
   * @param  {Interns} updateIntern : données du formulaire
   */
  onSubmit(updateIntern: Interns) {

    // On récupère les valeurs du formulaire dans un tableau d'objets
    const formInt = this.internForm.value;
    console.log('ici, formInt : ', formInt);


    // Pour lier au backend:
    // Etape 1 : on récupère les données du formulaire pour les mettre dans un objet
    this.interns = Object.assign(this.interns, formInt)
    // this.interns = Object.values(formInt)
    console.warn('ici, this.interns : ', this.interns)


    // Etape 2 : on envoie la nouvelle donnée au backend
    this._insternServ.postIntern(this.interns).subscribe((dataIntern: any) => {
      console.log('envoyé au backend: ' + dataIntern)
      if (dataIntern) {
        // const snackBarRef = this._snackBar.open('Le stagiaire a été ajouté à la base de donnée avec succès', 'ok', { verticalPosition: 'top' })
        // setTimeout(() => {
        //   snackBarRef.dismiss();
        //   location.reload();
        // }, 4000);
        this._matDialog.open(ConfirmAddInternModalComponent, {
          enterAnimationDuration: '200ms',
          exitAnimationDuration: '100ms',
          maxWidth: '300px'
        })

      }
    })

  }


  /** Cette méthode permet de filtrer les entrées du tableau pour les proposer titre par titre (mat-autocomplete)
   * @param  {string} value
   * @returns string
   */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    if (!this.titles) {
      return []; // Retourne un tableau vide si this.titles est undefined
    }

    return this.titles.filter(title => title.toLowerCase().includes(filterValue));
  }


  
  /** Cette méthode permet de revenir sur la page d'accueil */
  onBackToHome() {
    this._route.navigate(['/home'])
  }


  /** Cette méthode permet d'aller sur la page pour éditer les documents des stagiaires */
  onGoToEdit(){
    this._route.navigate(['/home/documents_stagiaire'])
  }


  /** Cette méthode permet de renvoyer les date en format JJ/MM/AAAA en base de données.
   * @returns any
   */
  changeFormatdate(): any {
    this.internForm.value.intern_firstdate = moment(this.internForm.value.intern_firstdate).format('DD-MM-YYYY');
    this.internForm.value.intern_lastdate = moment(this.internForm.value.intern_lastdate).format('DD-MM-YYYY');
    this.internForm.value.convention_date = moment(this.internForm.value.convention_date).format('DD-MM-YYYY');
    this.internForm.value.first_training_date = moment(this.internForm.value.first_training_date).format('DD-MM-YYYY');
  }


}
