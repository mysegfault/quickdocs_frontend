import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Interns } from 'src/app/models/interns.model';
import { HttpClient } from '@angular/common/http';
import { ConnexionService } from 'src/app/services/connexion.service';
import { InternsService } from 'src/app/services/interns.service';
import { map, Observable, startWith } from 'rxjs';
// Librairies relative à la génération des documents.
import Docxtemplater from 'docxtemplater';
// C'est une librairie qui permet de générer des fichiers docx/pptx à partir de template docx/pptx.
import PizZip from 'pizzip'; // PizZip est une bibliothèque JavaScript qui permet de créer, lire et modifier des fichiers ZIP en mémoire
import saveAs from 'file-saver'; // File-saver est une librairie js qui permet d'enregistrer des fichiers côté client.


@Component({
  selector: 'app-doc-intern',
  templateUrl: './doc-intern.component.html',
  styleUrls: ['./doc-intern.component.scss']
})
export class DocInternComponent implements OnInit {

  verifForm!: FormGroup;
  myControl = new FormControl('');
  interns = new Interns();
  intern_code!: Interns;
  idIntern!: any;
  showMore = false;
  allDataIntern!: Interns;
  formationSuivie!: Interns;
  allTitlesPrograms!: any;
  allCodesIntern!: any[];
  codes!: string[];
  filteredCode!: Observable<string[]>;


  constructor(private _fb: FormBuilder, private _insternServ: InternsService, private _programServ: ConnexionService) { }

  ngOnInit(): void {
    // Les attributs, à l'intérieur, servent à lier au html avec formControlName
    // on initialise avec le model User pour ensuite faire appel à object assign.
    this.verifForm = this._fb.group({
      intern_code: [this.interns.intern_code, Validators.required],
    })

    // On récupère les titres de chaques programmes car on en aura besoin pour comparer au submit.
    this._programServ.getAllLists().subscribe((listsFromBackend: any[]) => {
      console.log(listsFromBackend);
      this.allTitlesPrograms = listsFromBackend;
    })

    // On récupère les codes de destagiaires pour l'input du code des stagiaires
    this._insternServ.getAllCodeIntern().subscribe((codeFromBackend: any) => {
      console.log('liste des codes:', codeFromBackend);
      this.allCodesIntern = codeFromBackend;
      this.codes = this.allCodesIntern.map(arr => arr[0])
      // @ts-ignore
      this.filteredCode = this.verifForm?.get("intern_code")?.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      );
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

    // On récupère les infos à travers le backend :
    this._insternServ.postFindIntern(form).subscribe((resIdIntern: any) => {
      console.log('data recu du backend: ' + resIdIntern)
      this.idIntern = resIdIntern;
      console.log('idIntern :', this.idIntern);
      localStorage.setItem('internID', resIdIntern)

      // puis on récupère le nom de la formation pour le comparer au titre des programmes existant et ainsi réucpérer l'id du programmes qu'on stockera dans le localstorage pour afficher les données dans le template
      this._insternServ.getOneIntern(this.idIntern).subscribe((allDataFromIntern: any) => {
        console.log('allDataIntern : ', allDataFromIntern);
        this.allDataIntern = allDataFromIntern;
        console.log("Toutes les données d'un stagiaire : ", this.allDataIntern);
        this.formationSuivie = allDataFromIntern.intern_program;
        console.log("formation suivie : ", this.formationSuivie);

        // on compare : 
        const indexProgram = this.allTitlesPrograms.findIndex((arr: any) => arr[0] === this.formationSuivie);
        console.log(indexProgram);
        // on stocke :
        localStorage.setItem('programIDwithStagiaire', indexProgram)
      })

    })
  }



  
  /** Cette méthode permet de filtrer les entrées du tableau pour les proposer code par code (mat-autocomplete)
* @param  {string} value
* @returns string
*/
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    if (!this.codes) {
      return []; // Retourne un tableau vide si this.titles est undefined
    }

    return this.codes.filter(code => code.toLowerCase().includes(filterValue));
  }





  /** Cette méthode permet de générer l'attestation d'assiduité (format .docx) au clique sur le lien en HTML
   */
  generateAttestationAssiduite() {

      // On charge le modèle de document Word stocké sur ce chemin
      const file = `${window.location.origin}/assets/documents/attestation_assiduite.docx`;

      // On crée une nouvelle instance de l'objet XMLHttpRequest, qui sera utilisé pour charger le modèle Word.
      const xhr = new XMLHttpRequest();
      // On initialise la requête XMLHttpRequest en spécifiant la méthode HTTP (GET), l'URL du fichier (le chemin d'accès au modèle Word) et la valeur "true" pour indiquer que la requête est asynchrone.
      xhr.open('GET', file, true);
      // On spécifie le type de réponse que le serveur doit renvoyer, ici 'arraybuffer'(= objet JavaScript qui représente un tableau d'octets, des données). Le contenu du modèle Word pourra être stocké dans un tableau d'octets (Uint8Array).
      xhr.responseType = 'arraybuffer';

      // On défintit, dans un objet, les données que l'on souhaite insérer :
      const dataIntern = {
        genre: this.allDataIntern.intern_genre !== null ? this.allDataIntern.intern_genre : "",
        lastname: this.allDataIntern.intern_lastname !== null ? this.allDataIntern.intern_lastname : "",
        firstname: this.allDataIntern.intern_firstname !== null ? this.allDataIntern.intern_firstname : "",
        program_title: this.allDataIntern.intern_program !== null ? this.allDataIntern.intern_program : "",
        program_duration: this.allDataIntern.program_duration !== null ? this.allDataIntern.program_duration : "",
        firstdate: this.allDataIntern.intern_firstdate !== null ? this.allDataIntern.intern_firstdate : "",
        lastdate: this.allDataIntern.intern_lastdate !== null ? this.allDataIntern.intern_lastdate : "",
        module_format: this.allDataIntern.module_format !== null ? this.allDataIntern.module_format : "",
        intern_duration: this.allDataIntern.intern_duration !== null ? this.allDataIntern.intern_duration : "",
        taux_realisation: this.allDataIntern.intern_achievement !== null ? this.allDataIntern.intern_achievement : ""
      }
      console.log(dataIntern);

      // Lorsque XMLHttpRequest sera terminée, cette fonction de rappel sera exectuée :
      xhr.onload = () => {
        console.log('Le modèle de document Word a été chargé avec succès.');

        // On crée un nouveau tableau d'octets (Uint8Array) à partir des données renvoyées par le serveur dans xhr.response
        const data = new Uint8Array(xhr.response);
        // On crée une nouvelle instance de la classe PizZip en utilisant le tableau d'octets data.
        // PizZip est une bibliothèque JavaScript qui permet de créer, lire et modifier des fichiers ZIP en mémoire.
        const zip = new PizZip(data);
        // On crée une nouvelle instance de la classe Docxtemplater.
        const doc = new Docxtemplater();
        // On charge le contenu du fichier ZIP en mémoire
        doc.loadZip(zip);
        // On définit les données à insérer dynamiquement
        doc.setData(dataIntern);

        try {
          // On génère le document Word final
          doc.render();
          console.log('Le document a été généré avec succès.');
          // On récupère le contenu du fichier ZIP généré par Docxtemplater et le stocke dans un objet blob (Blob).
          // Blob est un objet JavaScript qui représente un fichier binaire brut.
          const output = doc.getZip().generate({type: 'blob'});
          console.log(output);
          // On crée un nom de fichier
          const filename = `Attestation_assiduite_${dataIntern.firstname}_${dataIntern.lastname}_${dataIntern.program_title}.docx`;
          console.log(`Le fichier ${filename} a été téléchargé avec succès.`);
          // On télécharge le fichier Word généré en utilisant la fonction saveAs fournie par la bibliothèque FileSaver.js.
          saveAs(output, filename);

        } catch (error) {
          console.log(JSON.stringify({error}));
          throw error;
        }
      };

      // On envoie la requête XMLHttpRequest au serveur pour charger le contenu du modèle Word.
      xhr.send();
    
  }
    
}