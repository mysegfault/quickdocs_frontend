import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Interns } from 'src/app/models/interns.model';
import { ConnexionService } from 'src/app/services/programs.service';
import { InternsService } from 'src/app/services/interns.service';
import { map, Observable, startWith } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmAddInternModalComponent } from 'src/app/modals/confirm-add-intern-modal/confirm-add-intern-modal.component';
import { Router } from '@angular/router';
import moment from 'moment';


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
      intern_zipcode: [this.interns.intern_zipcode, [Validators.pattern('^[0-9]+$')]],
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

    // On récupère les titres de chaque programmes pour les proposer dans le champs "intitulé de la formation suivie" (lié au mat-autocomplete)
    this._programServ.getAllLists().subscribe((listsFromBackend: any[]) => {
      console.log('tableau des titres :', listsFromBackend);
      this.allTitlesPrograms = listsFromBackend;
      // console.log(this.allTitlesPrograms);
      // Pour avoir chaques titres
      this.titles = this.allTitlesPrograms.map(tab => tab[0])
      // Le commentaire ci-dessous sert à indiquer au compilateur TypeScript d'ignorer l'erreur de vérification de type pour cette ligne de code.
      // @ts-ignore
      this.filteredTitles = this.internForm.get("intern_program").valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
        // Permet de remplacer le champs vide (ou commencant à être remplis) par la valeur choisie grâce à la méthode pipe().
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

    // Puis on les met dans un objet pour les envoyer au backend
    this.interns = Object.assign(this.interns, formInt)
    console.warn('ici, this.interns : ', this.interns)


    // On envoie la nouvelle donnée au backend
    this._insternServ.postIntern(this.interns).subscribe((dataIntern: any) => {
      console.log('envoyé au backend: ' + dataIntern)
      if (dataIntern) {

        // Si les infos ont bien été transmises au backend, on dit que c'est bon via une modale
        this._matDialog.open(ConfirmAddInternModalComponent, {
          enterAnimationDuration: '200ms',
          exitAnimationDuration: '100ms',
          maxWidth: '300px'
        })

      } else {

        // si ça n'est pas bon, on le dit par l'intermédiaire d'une snackbar
        const snackBarRef = this._snackBar.open('Attention! Le stagiaire n\'a pas pu être ajouté correctement', 'ok', { verticalPosition: 'top' })

        // On met un setTimout pour supprimer la snackbar automatiquement au bout de 5 secondes si l'utilisateur n'a pas appuyé sur 'ok' avant
        setTimeout(() => {
          snackBarRef.dismiss();
        }, 5000);
      }
    })

  }


  /** Cette méthode permet de revenir sur la page d'accueil */
  onBackToHome() {
    this._route.navigate(['/home'])
  }


  /** Cette méthode permet d'aller sur la page pour éditer les documents des stagiaires */
  onGoToEdit() {
    this._route.navigate(['/home/documents_stagiaire'])
  }



  /** Cette méthode est lié au mat-autocomplete. Elle agit comme un filtre. D'abord, elle propose toutes les valeurs puis, en fonction de ce qui est tapé par l'utilisateur, les données proposées vont diminuer.
   * @param  {string} value
   * @returns string
   */
  private _filter(value: string): string[] {

    // pour que le style de texte n'est pas d'impact lorsqu'on tape la donnée.
    const filterValue = value.toLowerCase();

    // On met une condition pour que la fonction marche même s'il manque la donnée à transmettre.
    if (!this.titles) {
      return []; // Retourne un tableau vide si this.titles est undefined
    }

    // Voila ce que fait la fonction. Filtre en fonction de ce que l'utilisateur tape.
    return this.titles.filter(title => title.toLowerCase().includes(filterValue));
  }



  /** Cette méthode permet de renvoyer les dates en format JJ/MM/AAAA en base de données.
   * @returns any
   */
  changeFormatdate(): any {
    this.internForm.value.intern_firstdate = moment(this.internForm.value.intern_firstdate).format('DD-MM-YYYY');
    this.internForm.value.intern_lastdate = moment(this.internForm.value.intern_lastdate).format('DD-MM-YYYY');
    this.internForm.value.convention_date = moment(this.internForm.value.convention_date).format('DD-MM-YYYY');
    this.internForm.value.first_training_date = moment(this.internForm.value.first_training_date).format('DD-MM-YYYY');
  }


}
