import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Interns } from 'src/app/models/interns.model';
import { ConnexionService } from 'src/app/services/connexion.service';
import { InternsService } from 'src/app/services/interns.service';
import { map, Observable, startWith } from 'rxjs';

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
  intern_firstdate!: Interns;
  intern_lastdate!: Interns;
  intern_duration!: Interns;
  intern_achievement!: Interns;
  intern_finance!: Interns;
  allTitlesPrograms!: any[];
  titles!: string[];
  filteredTitles!: Observable<string[]>;

  constructor(private _fb: FormBuilder, private _insternServ: InternsService, private _snackBar: MatSnackBar, private _programServ: ConnexionService) { }

  ngOnInit(): void {
    // Les attributs, à l'intérieur, servent à lier au html avec formControlName
    // on initialise avec le model Interns pour ensuite faire appel à object assign.
    this.internForm = this._fb.group({
      intern_code: [this.interns.intern_code, Validators.required],
      intern_genre: [this.interns.intern_genre, Validators.required],
      intern_lastname: [this.interns.intern_lastname, Validators.required],
      intern_firstname: [this.interns.intern_firstname, Validators.required],
      intern_adress: [this.interns.intern_adress, Validators.required],
      intern_zipcode: [this.interns.intern_zipcode, Validators.required],
      intern_city: [this.interns.intern_city, Validators.required],
      intern_program: [this.interns.intern_program, Validators.required],
      intern_firstdate: [this.interns.intern_firstdate, Validators.required],
      intern_lastdate: [this.interns.intern_lastdate, Validators.required],
      intern_duration: [this.interns.intern_duration, Validators.required],
      intern_achievement: [this.interns.intern_achievement, Validators.required],
      intern_finance: [this.interns.intern_finance, Validators.required]
    })

    // On récupère les titres de chaques programmes car on en a besoin p our le champs du nom de la formation suivie.
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
        this._snackBar.open('Le stagiaire a été ajouté à la base de donnée avec succès', 'ok', { verticalPosition: 'top' })
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

}
