import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { TaxService } from 'app/shared/services/tax.service';

@Component({
    selector: 'app-add-tax',
    templateUrl: './add-tax.component.html',
    styleUrls: ['./add-tax.component.scss'],
})
export class AddTaxComponent implements OnInit {
    addTaxForm: FormGroup;
    updateFormData: any = undefined;
    userId: any;
    isEdit: boolean = false; // this is for toggle button text add or edit
    // response: any;

    constructor(
        private _commonService: CommonService,
        private _taxService: TaxService,
        private _formBuilder: FormBuilder,
        private _route: Router,
        private changeDetection: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.userId = this._commonService.getUserId();
        this.addTaxForm = this._formBuilder.group({
            taxName: ['', Validators.required],
            taxRate: ['', Validators.required],
            userId: this.userId,
        });
    }

    get f() {
        return this.addTaxForm.controls;
    }

    ngAfterContentInit() {
        if (history.state.data) {
            this.updateFormData = history.state.data;
            this.isEdit = true;
            this.addTaxForm.patchValue(this.updateFormData);
            console.log(this.updateFormData);
        }
    }

    addOrEditTax() {
        if (this.addTaxForm.invalid) {
            for (const control of Object.keys(this.addTaxForm.controls)) {
                this.addTaxForm.controls[control].markAsTouched();
            }
            return;
        }

        if (this.addTaxForm.valid) {
            if (history.state.data) {
                // console.log(history.state.data);
                // console.log(this.addTaxForm.value);
                this.addTaxForm.value.userId = this.userId;
                this.addTaxForm.value.id = history.state.data.id;
                this._taxService
                    .updateTax(this.addTaxForm.value)
                    .subscribe((res) => {
                        console.log(this._commonService.decryptData(res));
                        this.addTaxForm.reset();
                        this._route.navigateByUrl('tax/manage-tax');
                        this.changeDetection.detectChanges();
                    });
            } else {
                this._taxService
                    .addTax(this.addTaxForm.value)
                    .subscribe((res) => {
                        console.log(this._commonService.decryptData(res));
                        this.addTaxForm.reset();
                        this._route.navigateByUrl('tax/manage-tax');
                        this.changeDetection.detectChanges();
                    });
            }
        }
    }

    navigateToHome() {
        this._commonService.navigateToHome();
    }
}
