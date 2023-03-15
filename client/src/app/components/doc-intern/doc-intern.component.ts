import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Interns } from 'src/app/models/interns.model';
import { HttpClient } from '@angular/common/http';
import { ConnexionService } from 'src/app/services/programs.service';
import { InternsService } from 'src/app/services/interns.service';
import { map, Observable, startWith } from 'rxjs';
// Librairies relative à la génération des documents.
import Docxtemplater from 'docxtemplater';
// C'est une librairie qui permet de générer des fichiers docx/pptx à partir de template docx/pptx.
import PizZip from 'pizzip'; // PizZip est une bibliothèque JavaScript qui permet de créer, lire et modifier des fichiers ZIP en mémoire
import saveAs from 'file-saver'; // File-saver est une librairie js qui permet d'enregistrer des fichiers côté client.
import { Router } from '@angular/router';

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


  constructor(private _fb: FormBuilder, private _insternServ: InternsService, private _programServ: ConnexionService, private _route: Router) { }

  ngOnInit(): void {

    // le formulaire. Lier au html avec formControlName
    this.verifForm = this._fb.group({
      intern_code: [this.interns.intern_code, Validators.required],
    })


    // Pour le mat-autocomplete : On récupère les codes de stagiaires pour les proposer dans le champs "code du stagiaires".
    this._insternServ.getAllCodeIntern().subscribe((codeFromBackend: any) => {
      // console.log('liste des codes:', codeFromBackend);
      this.allCodesIntern = codeFromBackend;
      // Pour avoir chaque code, on map
      this.codes = this.allCodesIntern.map(tab => tab[0])
      // Le commentaire ci-dessous sert à indiquer au compilateur TypeScript d'ignorer l'erreur de vérification de type pour cette ligne de code.
      // @ts-ignore
      this.filteredCode = this.verifForm.get("intern_code").valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
        // Permet de remplacer le champs vide (ou commencant à être remplis) par la valeur choisie grâce à la méthode pipe().
      );
    })

  }

  /** Cette méthode permet de récupérer les infos de l'utilisateurs puis les infos de la formation, grâce au champ "Intitulé de la formation" pour transférer les infos utiles au template à éditer. */
  onSubmit() {

    // on fait apparaitre les documents à éditer qui n'était pas visible avant la validation du champs.
    this.showMore = true;

    // On récupère les valeurs du formulaire dans un tableau d'objets
    const form = this.verifForm.value;
    // console.log('ici, form : ', form);

    // On envoie le code du stagiaire (récupéré dans le champ) au backend pour recevoir son id :
    this._insternServ.postFindIntern(form).subscribe((resIdIntern: any) => {
      // console.log('data recu du backend: ' + resIdIntern)
      this.idIntern = resIdIntern;
      // console.log('idIntern :', this.idIntern);

      //  Puis, grâce à l'id du stagiaire, on récupère toutes ses informations pour le document à éditer.
      this._insternServ.getOneIntern(this.idIntern).subscribe((allDataFromIntern: any) => {
        // console.log("Toutes les données d'un stagiaire : ", this.allDataIntern);
        this.allDataIntern = allDataFromIntern;
      })

    })
  }



  /** Cette méthode permet de revenir sur la page d'accueil */
  onBackToHome() {
    this._route.navigate(['/home'])
  }

  /** Cette méthode permet d'aller sur la page pour ajouter des stagiaires */
  onGoToEdit() {
    this._route.navigate(['/home/ajouter_stagiaire'])
  }



  /** Cette méthode est lié au mat-autocomplete. Elle agit comme un filtre. D'abord, elle propose toutes les valeurs puis, en fonction de ce qui est tapé par l'utilisateur, les données proposées vont diminuer.
* @param  {string} value
* @returns string
*/
  private _filter(value: string): string[] {
    // pour que le style de texte n'est pas d'impact lorsqu'on tape la donnée.
    const filterValue = value.toLowerCase();

    // On met une condition pour que la fonction marche même s'il manque la donnée à transmettre.
    if (!this.codes) {
      return []; // Retourne un tableau vide si this.codes est undefined
    }

    // Voila ce que fait la fonction. Filtre en fonction de ce que l'utilisateur tape.
    return this.codes.filter(code => code.toLowerCase().includes(filterValue));
  }





  /** Cette méthode, asynchrone, permet de générer l'attestation d'assiduité (format .docx) au clique sur le lien en HTML
   */
  async onGenerateAttestationAssiduite() {

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
    // console.log('datatIntern : ', dataIntern);

    // On met le chemin d'accès au template dans une variable
    const file = `${window.location.origin}/assets/documents/attestation_assiduite.docx`;
    //  on utilise la méthode fetch() pour récupérer le contenu du template
    const response = await fetch(file);
    //  on utilise arrayBuffer() pour récupérer les données sous forme de tableau d'octets
    const data = await response.arrayBuffer();

    // PizZip est une bibliothèque JavaScript qui permet de créer, lire et modifier des fichiers ZIP en mémoire. On lui transmet les données du template
    const zip = new PizZip(data);
    // On crée une nouvelle instance de la classe Docxtemplater pour générer le nouveau document avec les données de la BDD
    const doc = new Docxtemplater();
    // On charge le contenu du fichier ZIP en mémoire
    doc.loadZip(zip);
    // On définit les données à insérer dynamiquement
    doc.setData(dataIntern);

    try {
      // On génère le document Word final
      doc.render();
      // console.log('Le document a été généré avec succès.');
      // On récupère le contenu du fichier ZIP généré par Docxtemplater et le stocke dans un objet blob (Blob).
      // Blob est un objet JavaScript qui représente un fichier binaire brut.
      const output = doc.getZip().generate({ type: 'blob' });
      // console.log('output :', output);
      // On crée un nom de fichier
      const filename = `Attestation_assiduite_${dataIntern.firstname}_${dataIntern.lastname}_${dataIntern.program_title}.docx`;
      // On télécharge le fichier Word généré en utilisant la fonction saveAs fournie par la bibliothèque FileSaver.js.
      saveAs(output, filename);
      // console.log(`Le fichier ${filename} a été téléchargé avec succès.`);
    } catch (error) {
        throw error;
    }
  }



  /** Cette méthode permet de générer le certificat de réalisation (format .docx) au clique sur le lien en HTML
   */
  async onGenerateCertificat() {

    const dataIntern = {
      genre: this.allDataIntern.intern_genre !== null ? this.allDataIntern.intern_genre : "",
      lastname: this.allDataIntern.intern_lastname !== null ? this.allDataIntern.intern_lastname : "",
      firstname: this.allDataIntern.intern_firstname !== null ? this.allDataIntern.intern_firstname : "",
      program_title: this.allDataIntern.intern_program !== null ? this.allDataIntern.intern_program : "",
      firstdate: this.allDataIntern.intern_firstdate !== null ? this.allDataIntern.intern_firstdate : "",
      lastdate: this.allDataIntern.intern_lastdate !== null ? this.allDataIntern.intern_lastdate : "",
      program_duration: this.allDataIntern.program_duration !== null ? this.allDataIntern.program_duration : "",
      intern_duration: this.allDataIntern.intern_duration !== null ? this.allDataIntern.intern_duration : "",
      taux_realisation: this.allDataIntern.intern_achievement !== null ? this.allDataIntern.intern_achievement : ""
    }

    const file = `${window.location.origin}/assets/documents/certificat_de_realisation.docx`;
    const response = await fetch(file);
    const data = await response.arrayBuffer();

    const zip = new PizZip(data);
    const doc = new Docxtemplater();
    doc.loadZip(zip);
    doc.setData(dataIntern);

    try {
      doc.render();

      const output = doc.getZip().generate({ type: 'blob' });
      const filename = `Certificat_realisation_${dataIntern.firstname}_${dataIntern.lastname}_${dataIntern.program_title}.docx`;
      saveAs(output, filename);

    } catch (error) {

      throw error;
    }

  }


  /** Cette méthode permet de générer la convention de formation professionnelle (format .docx) au clique sur le lien en HTML
     */
  async onGenerateConevention() {

    const dataIntern = {
      program_title: this.allDataIntern.intern_program !== null ? this.allDataIntern.intern_program : "",
      number_convention: this.allDataIntern.number_convention !== null ? this.allDataIntern.number_convention : "",
      genre: this.allDataIntern.intern_genre !== null ? this.allDataIntern.intern_genre : "",
      lastname: this.allDataIntern.intern_lastname !== null ? this.allDataIntern.intern_lastname : "",
      firstname: this.allDataIntern.intern_firstname !== null ? this.allDataIntern.intern_firstname : "",
      adress: this.allDataIntern.intern_adress !== null ? this.allDataIntern.intern_adress : "",
      zipcode: this.allDataIntern.intern_zipcode !== null ? this.allDataIntern.intern_zipcode : "",
      city: this.allDataIntern.intern_city !== null ? this.allDataIntern.intern_city : "",
      firstdate: this.allDataIntern.intern_firstdate !== null ? this.allDataIntern.intern_firstdate : "",
      lastdate: this.allDataIntern.intern_lastdate !== null ? this.allDataIntern.intern_lastdate : "",
      program_duration: this.allDataIntern.program_duration !== null ? this.allDataIntern.program_duration : "",
      nb_modules: this.allDataIntern.module_number !== null ? this.allDataIntern.module_number : "",
      module_format: this.allDataIntern.module_format !== null ? this.allDataIntern.module_format : "",
      program_format: this.allDataIntern.program_format !== null ? this.allDataIntern.program_format : "",
      nb_intern: this.allDataIntern.number_intern !== null ? this.allDataIntern.number_intern : "",
      training_cost: this.allDataIntern.training_cost !== null ? this.allDataIntern.training_cost : "",
      learning_cost: this.allDataIntern.learning_cost !== null ? this.allDataIntern.learning_cost : "",
      total_cost: this.allDataIntern.total_cost !== null ? this.allDataIntern.total_cost : "",
      accompt: this.allDataIntern.deposit !== null ? this.allDataIntern.deposit : "",
      convention_date: this.allDataIntern.convention_date !== null ? this.allDataIntern.convention_date : "",
    }

    const file = `${window.location.origin}/assets/documents/convention_formation_particulier.docx`;
    const response = await fetch(file);
    const data = await response.arrayBuffer();

      const zip = new PizZip(data);
      const doc = new Docxtemplater();
      doc.loadZip(zip);
      doc.setData(dataIntern);

      try {
        doc.render();
        // console.log('Le document a été généré avec succès.');
        const output = doc.getZip().generate({ type: 'blob' });
        // console.log(output);
        const filename = `Convention_formation_${dataIntern.firstname}_${dataIntern.lastname}_${dataIntern.program_title}.docx`;
        // console.log(`Le fichier ${filename} a été téléchargé avec succès.`);
        saveAs(output, filename);

      } catch (error) {
        throw error;
      }

  }


  /** Cette méthode permet de générer une feuille d'émargement individuelle (format .docx) au clique sur le lien en HTML
     */
  async onGenerateEmargement() {
    
    const dataIntern = {
      lastname: this.allDataIntern.intern_lastname !== null ? this.allDataIntern.intern_lastname : "",
      firstname: this.allDataIntern.intern_firstname !== null ? this.allDataIntern.intern_firstname : "",
      program_title: this.allDataIntern.intern_program !== null ? this.allDataIntern.intern_program : "",
      firstdate: this.allDataIntern.intern_firstdate !== null ? this.allDataIntern.intern_firstdate : "",
      lastdate: this.allDataIntern.intern_lastdate !== null ? this.allDataIntern.intern_lastdate : "",
      program_duration: this.allDataIntern.program_duration !== null ? this.allDataIntern.program_duration : "",
      funder: this.allDataIntern.intern_finance !== null ? this.allDataIntern.intern_finance : "",
      first_training_date: this.allDataIntern.first_training_date !== null ? this.allDataIntern.first_training_date : "",
    }

    const file = `${window.location.origin}/assets/documents/feuille_emargement_individuelle.docx`;
    const response = await fetch(file);
    const data = await response.arrayBuffer();

      const zip = new PizZip(data);
      const doc = new Docxtemplater();
      doc.loadZip(zip);
      doc.setData(dataIntern);

      try {
        doc.render();
        // console.log('Le document a été généré avec succès.');
        const output = doc.getZip().generate({ type: 'blob' });
        // console.log(output);
        const filename = `Feuille_emargement_individuelle_${dataIntern.firstname}_${dataIntern.lastname}_${dataIntern.program_title}.docx`;
        // console.log(`Le fichier ${filename} a été téléchargé avec succès.`);
        saveAs(output, filename);

      } catch (error) {
        throw error;
      }

  }



}