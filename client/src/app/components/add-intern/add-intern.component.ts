import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Interns } from 'src/app/models/interns.model';

@Component({
  selector: 'app-add-intern',
  templateUrl: './add-intern.component.html',
  styleUrls: ['./add-intern.component.scss']
})
export class AddInternComponent implements OnInit {

  internForm!: FormGroup;
  myControl = new FormControl('');
  interns = new Interns();
  intern_code!: string;
  intern_genre!: string;
  intern_lastname!: string;
  intern_firstname!: string;
  intern_adress!: string;
  intern_zipcode!: number;
  intern_city!: string;
  intern_program!: string;
  intern_firstdate!: string;
  intern_lastdate!: string;
  intern_duration!: string;
  intern_achievement!: string;
  intern_finance!: string;
  
  constructor( private _fb: FormBuilder, private _snackBar: MatSnackBar ) { }

  ngOnInit(): void {
    // Les attributs, à l'intérieur, servent à lier au html avec formControlName
    // on initialise avec le model User pour ensuite faire appel à object assign.
    this.internForm = this._fb.group({
      intern_code: ["", Validators.required],
      intern_genre: ["", Validators.required],
      intern_lastname: ["", Validators.required],
      intern_firstname: ["", Validators.required],
      intern_adress: ["", Validators.required],
      intern_zipcode: ["", Validators.required],
      intern_city: ["", Validators.required],
      intern_program: ["", Validators.required],
      intern_firstdate: ["", Validators.required],
      intern_lastdate: ["", Validators.required],
      intern_duration: ["", Validators.required],
      intern_achievement: ["", Validators.required],
      intern_finance: ["", Validators.required]
    })

  }

  onSubmit(updateIntern: Interns) {}



}
