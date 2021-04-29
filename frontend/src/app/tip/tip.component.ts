import { Component, Input, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  name: string;
}

/* Компонент заметки */

@Component({
  selector: 'app-tip',
  templateUrl: './tip.component.html',
  styleUrls: ['./tip.component.scss']
})
export class TipComponent {

  @Input() tip;

  constructor(public editDialog: MatDialog) {}

  openEditDialog() {
    const editDialogRef = this.editDialog.open(EditDialog, {
      data: {name: this.tip.name}
    });
  }

}

@Component({
  selector: 'dialog-content-example-dialog',
  template: `<h1>{{data.name}}</h1>`,
})
export class EditDialog {
  constructor(
    public dialogRef: MatDialogRef<EditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}