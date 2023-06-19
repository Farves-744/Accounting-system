import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from 'app/app.component';
import { DashboardComponent } from 'app/modules/admin/dashboard/dashboard.component';
import { CommonService } from 'app/shared/services/common.service';
import { TaxService } from 'app/shared/services/tax.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-add-tax',
    templateUrl: './add-tax.component.html',
    styleUrls: ['./add-tax.component.scss']


})
export class AddTaxComponent implements OnInit {
    addTaxForm: FormGroup;
    updateFormData: any = undefined;
    userId: any;
    isEdit: boolean = false; // this is for toggle button text add or edit
    // response: any;

    isAccessToManageTax: any;
    dashboardAccess: any

    constructor(
        private _commonService: CommonService,
        private _taxService: TaxService,
        private _formBuilder: FormBuilder,
        private messageService: MessageService,
        private _route: Router,
        private changeDetection: ChangeDetectorRef
    ) {
        this.isAccessToManageTax = (AppComponent.checkUrl("manageTax"))
        this.dashboardAccess = (AppComponent.checkUrl("dashboards"))
    }

    ngOnInit(): void {
        this.userId = this._commonService.getUserId();
        this.addTaxForm = this._formBuilder.group({
            taxName: ['', [Validators.required, Validators.maxLength(50)]],
            taxRate: ['', Validators.required],
            userId: this.userId,
        });
    }

    get f() {
        return this.addTaxForm.controls;
    }

    back() {
        this._route.navigateByUrl('/tax/manage-tax')
    }

    ngAfterContentInit() {
        if (history.state.data) {
            this.updateFormData = history.state.data;
            this.isEdit = true;
            this.addTaxForm.patchValue(this.updateFormData);
            // console.log(this.updateFormData);
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
                        // console.log(this._commonService.decryptData(res));
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Tax updated successfully' });
                        this.addTaxForm.reset();

                        setTimeout(() => {
                            if (this.isAccessToManageTax) {
                                this._route.navigateByUrl('tax/manage-tax');
                            } else {
                                this._route.navigateByUrl('tax/add-tax');
                            }
                        }, 2000);
                        this.changeDetection.detectChanges();
                    }, error => {
                        this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Something went wrong' });
                    });
            } else {
                this._taxService
                    .addTax(this.addTaxForm.value)
                    .subscribe((res) => {
                        // console.log(this._commonService.decryptData(res));
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Tax added successfully' });
                        this.addTaxForm.reset();
                        setTimeout(() => {
                            if (this.isAccessToManageTax) {
                                this._route.navigateByUrl('tax/manage-tax');
                            } else {
                                this._route.navigateByUrl('tax/add-tax');
                            }
                        }, 2000);
                        this.changeDetection.detectChanges();
                    }, error => {
                        this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Something went wrong' });
                    });
            }
        }
    }

    navigateToHome() {
        this._commonService.navigateToHome();
    }
}
