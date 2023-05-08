import { Component, OnInit } from '@angular/core';
import { CommonService } from 'app/shared/services/common.service';
import { CollectDialogComponent } from '../collect-dialog/collect-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-add-income',
    templateUrl: './add-income.component.html',
    styleUrls: ['./add-income.component.scss'],
})
export class AddIncomeComponent {
    files: any[] = [];
    categories = [
        { name: 'Sales Revenue', id: 1 },
        { name: 'Interest Revenue', id: 2 },
        { name: 'Commission Revenue', id: 3 },
    ];

    accounts = [
        { name: 'Farves', id: 1 },
        { name: 'Irsath', id: 2 },
        { name: 'Moosa', id: 3 },
    ];

    taxes = [
        { name: 'GST', id: 1 },
        { name: 'VAT', id: 2 },
    ];

    isDisabled: boolean = true;
    taxRate: any;
    file: File;
    imageUrl: any;

    textInputDisabled = true;

    constructor(
        private commonService: CommonService,
        public dialog: MatDialog
    ) {}

    toggleTaxInput() {
        this.textInputDisabled = !this.textInputDisabled;
    }

    navigateToHome() {
        this.commonService.navigateToHome();
    }

    ngOnInit() {}

    openCollectDialog() {
        const dialogRef = this.dialog.open(CollectDialogComponent, {
            width: '900px',
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);
        });
    }

    // hey(event) {
    //     console.log(event.target.files[0]);
    //     console.log(event.target.files);
    // }

    onFileDropped(event) {
        this.file = event[0];
        console.log(this.file);
        let reader = new FileReader();
        reader.onload = (event: any) => {
            this.imageUrl = event.target.result;
        };
        reader.readAsDataURL(this.file);

        // console.log(this.imageUrl);
        // console.log(this.fileToUpload);
    }

    saveImage(event: any) {
        this.file = event.target.files[0];
        console.log(this.file);
        let reader = new FileReader();
        reader.onload = (event: any) => {
            this.imageUrl = event.target.result;
        };
        reader.readAsDataURL(this.file);
        // console.log(this.imageUrl);
        // console.log(this.fileToUpload);
    }
}
