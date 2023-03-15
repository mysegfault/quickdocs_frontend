import { Component, OnInit } from '@angular/core';
import { ConnexionService } from 'src/app/services/programs.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';
import { Programs } from 'src/app/models/programs.model';
// Librairies relative à la génération des documents.
import Docxtemplater from 'docxtemplater';
// C'est une librairie qui permet de générer des fichiers docx/pptx à partir de template docx/pptx.
import PizZip from 'pizzip'; // PizZip est une bibliothèque JavaScript qui permet de créer, lire et modifier des fichiers ZIP en mémoire
import saveAs from 'file-saver'; // File-saver est une librairie js qui permet d'enregistrer des fichiers côté client.

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit {

  allList!: any[];
  program!: Programs;

  constructor(private _programServ: ConnexionService, private _route: Router, private _authService: SocialAuthService) { }

  ngOnInit() {

    // On récupère les titres de chaques programmes
    this._programServ.getAllLists().subscribe((listsFromBackend: any[]) => {
      // console.log('listsFromBackend : ' , listsFromBackend);
      this.allList = listsFromBackend;
    })

  }


  /** Cette méthode permet de revenir sur la page d'accueil */
  onBackToHome() {
    this._route.navigate(['/home'])
  }



  /** Cette méthode permet de générer le programme en format .docx grâce à un template contenu dans assets/programmes */
  onGenerateProgram(i: number) {

    // On récupère l'id du programme sélectionné
    // On ajuste l'index à +2 car : +1 pour les index de tableau quiccommence à 0 a lors que la feuille de calcul commence à 1 et +1 car la première lignes de cette feuille de calcul commence par les titres.
    const idList = i + 2;
    // console.log('idList : ', idList);

    // Puis on récupère toutes les informations lié à cette id de programme.
    this._programServ.getOneList(idList).subscribe(async (returnProgram: Programs) => {
      // console.log(returnProgram);
      this.program = returnProgram;


      // On définit, dans un objet, les données que l'on souhaite insérer :
      const dataProgram = {
        program_title: this.program.titre_programme !== null ? this.program.titre_programme : "",
        program_format: this.program.chapeau_titre !== null ? this.program.chapeau_titre : "",
        program_version: this.program.version_programme !== null ? this.program.version_programme : "",
        program_intro: this.program.introduction !== null ? this.program.introduction : "",
        program_under_intro: this.program.chapeau_introduction !== null ? this.program.chapeau_introduction : "",
        program_cost: this.program.prix_formation !== null ? this.program.prix_formation : "",
        program_admin_cost: this.program.frais_dossier !== null ? this.program.frais_dossier : "",
        program_objectives: this.program.cont_objectifs !== null ? this.program.cont_objectifs : "",
        program_duration: this.program.cont_duree !== null ? this.program.cont_duree : "",
        format_modules: this.program.cont_dates !== null ? this.program.cont_dates : "",
        program_public: this.program.cont_public !== null ? this.program.cont_public : "",
        prerequisite: this.program.cont_pre_requis !== null ? this.program.cont_pre_requis : "",
        under_prerequisite: this.program.sous_prerequis !== null ? this.program.sous_prerequis : "",
        flexible: this.program.chapeau_intitule_verso !== null ? this.program.chapeau_intitule_verso : "",
        program_under_title1: this.program.titre_programme_generique !== null ? this.program.titre_programme_generique : "",
        cont_under_title1: this.program.contenu_programme_generique !== null ? this.program.contenu_programme_generique : "",
        program_under_title2: this.program.titre_programme_autre !== null ? this.program.titre_programme_autre : "",
        cont_under_title2: this.program.contenu_programme_autre !== null ? this.program.contenu_programme_autre : "",
        program_peda_eval: this.program.cont_moyens_peda !== null ? this.program.cont_moyens_peda : "",
        access: this.program.cont_accessibilite !== null ? this.program.cont_accessibilite : "",
        program_delay: this.program.cont_delai !== null ? this.program.cont_delai : "",
      }

      // On récupère le contenu du template
      const file = `${window.location.origin}/assets/programmes/Programme_les_bases_de_la_photographie.docx`;
      const response = await fetch(file);
      const data = await response.arrayBuffer();

      // On crée une nouvelle instance de la classe PizZip en utilisant le tableau d'octets data.
      // PizZip est une bibliothèque JavaScript qui permet de créer, lire et modifier des fichiers ZIP en mémoire.
      const zip = new PizZip(data);
      // On crée une nouvelle instance de la classe Docxtemplater.
      const doc = new Docxtemplater();
      // On charge le contenu du fichier ZIP en mémoire
      doc.loadZip(zip);
      // On définit les données à insérer dynamiquement
      doc.setData(dataProgram);

      try {
        // On génère le document Word final
        doc.render();
        // console.log('Le document a été généré avec succès.');
        // On récupère le contenu du fichier ZIP généré par Docxtemplater et le stocke dans un objet blob (Blob).
        // Blob est un objet JavaScript qui représente un fichier binaire brut.
        const output = doc.getZip().generate({ type: 'blob' });
        // console.log(output);
        // On crée un nom de fichier
        const filename = `Programme_${dataProgram.program_title}.docx`;
        // console.log(`Le fichier ${filename} a été téléchargé avec succès.`);
        // On télécharge le fichier Word généré en utilisant la fonction saveAs fournie par la bibliothèque FileSaver.js.
        saveAs(output, filename);

      } catch (error) {
          throw error;
      }


    })

  }


}







  // /** Cette méthode est situé sur le bouton du router "ouvrir" et elle permet de ne plus afficher la liste des programmes */
  // onOpenProgram(i: number) {

  //   // On ajuste l'index à +2 car : +1 pour les index de tableau quiccommence à 0 a lors que la feuille de calcul commence à 1 et +1 car la première lignes de cette feuille de calcul commence par les titres.
  //   const idList = i + 2;
  //   console.log(idList);
  //   const programID = JSON.stringify(idList)

  //   // On stocke l'id dans le localstorage pour le récupérer pour la page programme_pdf
  //   localStorage.setItem('programID', programID)
  //   // Puis on redirige vers la page du programmes à imprimer
  //   this._route.navigate(['/programme_pdf'])

  // }