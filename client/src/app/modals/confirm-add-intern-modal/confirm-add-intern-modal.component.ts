import { Component } from '@angular/core';

@Component({
  selector: 'app-confirm-add-intern-modal',
  templateUrl: './confirm-add-intern-modal.component.html',
  styleUrls: ['./confirm-add-intern-modal.component.scss']
})
export class ConfirmAddInternModalComponent {


  onValidAndRefresh() {

    location.reload()
    
  }

}
