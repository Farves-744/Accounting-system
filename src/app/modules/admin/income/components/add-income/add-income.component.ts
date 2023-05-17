import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'app/shared/services/common.service';
import { CollectDialogComponent } from '../collect-dialog/collect-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IncomeService } from 'app/shared/services/income.service';
import { Router } from '@angular/router';
import { getIncomeCategory } from 'app/shared/modals/income-category';
import { TaxService } from 'app/shared/services/tax.service';
import { GetTax } from 'app/shared/modals/tax';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-add-income',
    templateUrl: './add-income.component.html',
    styleUrls: ['./add-income.component.scss'],
})
export class AddIncomeComponent {
    addIncomeForm: FormGroup;
    includeInputDisabled = true;
    includeInputChecked = false;
    excludeInputDisabled = true;
    excludeInputChecked = false;
    showFinal: boolean = false;
    categoryData: any;
    taxRate: number = null;
    taxData: any;
    files: any[] = [];
    finalAmount: number = null;
    isDisabled: boolean = true;
    env = environment;
    file: File = null;
    imageUrl: any;
    userId: any;
    imageId: any;
    getCategoryNameModal: getIncomeCategory = new getIncomeCategory();
    getTaxNameModal: GetTax = new GetTax();
    updateFormData: any;

    @ViewChild('exclude') exclude: any;
    @ViewChild('include') include: any;

    constructor(
        private _commonService: CommonService,
        private _incomeService: IncomeService,
        private _taxService: TaxService,
        private _formBuilder: FormBuilder,
        private _route: Router,
        private changeDetection: ChangeDetectorRef,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
        this.userId = this._commonService.getUserId();
        this.addIncomeForm = this._formBuilder.group({
            totalAmount: [null, [Validators.required, Validators.min(100)]],
            description: ['', Validators.minLength(1)],
            taxApplicable: 0,
            taxId: [{ value: null, disabled: true }],
            imageId: this.imageId,
            image_url: '',
            categoryId: [null, Validators.required],
            payments: [[]],
            file: null,
            type: 0,
            taxAmount: null,
            deleteImageId: null,
        });
        this.getCategoryNameModal.userId = this.userId;
        this.getCategoryName();
        this.getTaxNameModal.userId = this.userId;
        this.getTaxName();
        console.log(this.addIncomeForm.value.taxApplicable);
    }

    get f() {
        return this.addIncomeForm.controls;
    }

    calculateTax(value) {
        console.log(value);

        console.log(this.addIncomeForm.value.taxApplicable);
        if (this.addIncomeForm.value.taxApplicable == 1) {
            this.addIncomeForm.patchValue({
                taxAmount:
                    this.addIncomeForm.value.totalAmount -
                    (this.addIncomeForm.value.totalAmount * 100) /
                    (100 + value),
            });
            console.log(this.addIncomeForm.value.taxAmount);

            this.addIncomeForm.value.totalAmount =
                (this.addIncomeForm.value.totalAmount * 100) /
                (100 + parseInt(value));
            console.log(this.addIncomeForm.value.totalAmount);
            this.addIncomeForm.value.finalAmount =
                this.addIncomeForm.value.totalAmount +
                this.addIncomeForm.value.taxAmount;
            this.finalAmount = this.addIncomeForm.value.finalAmount;

            console.log(this.addIncomeForm.value.finalAmount);
        } else if (this.addIncomeForm.value.taxApplicable == 2) {
            this.addIncomeForm.patchValue({
                taxAmount:
                    this.addIncomeForm.value.totalAmount -
                    (this.addIncomeForm.value.totalAmount * 100) /
                    (100 + value),
            });

            console.log(this.addIncomeForm.value.taxAmount);

            this.addIncomeForm.value.totalAmount =
                this.addIncomeForm.value.totalAmount;
            this.addIncomeForm.value.finalAmount = Math.round(
                this.addIncomeForm.value.totalAmount +
                this.addIncomeForm.value.taxAmount
            );
            this.finalAmount = this.addIncomeForm.value.finalAmount;

            console.log(this.addIncomeForm.value.finalAmount);
        }
    }

    calculateTaxBySelect(event) {
        console.log(event);
        for (let tax of this.taxData) {
            if (tax.id == event) {
                this.taxRate = tax.taxRate;

                console.log(this.taxRate);
                console.log(tax);

                this.calculateTax(this.taxRate);
            }
        }
        console.log(this.addIncomeForm.value.taxAmount);
    }

    calculateTaxByRadio(event) {
        this.getTaxApplicableValue(event);
        if (this.finalAmount != null) {
            this.calculateTax(this.taxRate);
        }
        console.log(event);
    }

    ngAfterContentInit() {
        if (history.state.data) {
            console.log(history.state.data);

            console.log(this.taxRate);

            this.addIncomeForm.value.userId = this.userId;
            this.addIncomeForm.value.id = history.state.data;
            console.log(this.addIncomeForm.value);

            this._incomeService
                .getIncomeById(this.addIncomeForm.value)
                .subscribe((res) => {
                    console.log(this._commonService.decryptData(res));

                    this.updateFormData = this._commonService.decryptData(res);

                    console.log(this.updateFormData);

                    this.addIncomeForm.patchValue(this.updateFormData);
                    this.taxRate = this.updateFormData.taxId;
                    console.log(this.taxRate);
                    this.calculateTaxBySelect(this.taxRate);

                    this.addIncomeForm.value.id = history.state.data;
                    this.imageUrl =
                        this.env.BASE_URL + '/' + this.updateFormData.imageUrl;
                    console.log(this.imageUrl);
                    if (this.updateFormData.taxApplicable == 1) {
                        // this.textInputDisabled = false;
                        // console.log(this.textInputDisabled);

                        this.includeInputDisabled = false;
                        this.excludeInputDisabled = false;
                        this.includeInputChecked = true;

                        this.addIncomeForm.controls.taxApplicable.enable();
                        // this.exclude.disabled = false;
                        // this.addIncomeForm.value.taxApplicable =
                        //     this.updateFormData.taxApplicable;
                        // this.finalAmount = this.updateFormData.totalAmount;
                    }
                    if (
                        this.updateFormData.taxApplicable == 1 ||
                        this.updateFormData.taxApplicable == 2
                    ) {
                        this.showFinal = true;

                        this.addIncomeForm.controls.taxId.enable();
                        // this.textInputDisabled = false;
                        this.includeInputDisabled = false;
                        this.excludeInputDisabled = false;
                        // this.include.disabled = false;
                        // this.include.checked = true;

                        // this.addIncomeForm.value.taxApplicable =
                        //     this.updateFormData.taxApplicable;
                    } else {
                        this.showFinal = false;
                    }

                    if (this.updateFormData.taxApplicable == 2) {
                        // this.exclude.disabled = false;
                        // this.exclude.checked = true;
                        // this.include.disabled = false;
                        // this.taxInputDisabled = false;
                        // this.include.checked = false;
                        // this.textInputChecked = true;
                        // this.textInputDisabled = true;

                        this.includeInputDisabled = false;
                        this.excludeInputDisabled = false;
                        this.includeInputChecked = false;
                        this.excludeInputChecked = true;
                    }

                    this.changeDetection.detectChanges();
                    console.log(this.updateFormData);
                });
        }
    }

    toggleTaxInput(event) {
        console.log(event);

        if (event.checked == true) {
            this.showFinal = true;
            this.addIncomeForm.patchValue({ taxApplicable: 1 });
            this.addIncomeForm.controls.taxId.enable();

            this.includeInputDisabled = false;
            this.excludeInputDisabled = false;
            this.includeInputChecked = true;

            // this.taxInputDisabled = false;
            // this.include.disable = false;

            if (this.addIncomeForm.value.finalAmount != null) {
                this.calculateTax(this.taxRate);
            }
        } else {
            this.showFinal = false;
            this.addIncomeForm.patchValue({ taxApplicable: 0 });
            console.log(this.addIncomeForm.value.taxApplicable);
            // this.taxInputDisabled = true;
            this.includeInputDisabled = true;
            this.includeInputChecked = false;
            this.excludeInputDisabled = true;
            this.excludeInputChecked = false;

            // this.exclude.checked = false;
            this.addIncomeForm.controls.taxId.disable();
            this.addIncomeForm.value.totalAmount =
                this.addIncomeForm.value.totalAmount;
            console.log(this.addIncomeForm.value.totalAmount);

            this.addIncomeForm.value.finalAmount =
                this.addIncomeForm.value.totalAmount;
            console.log(this.addIncomeForm.value.finalAmount);
            this.addIncomeForm.value.taxAmount = null;

            console.log(this.addIncomeForm.value.taxAmount);
        }

        if (this.addIncomeForm.value.taxApplicable == 0) {
            // this.textInputChecked = false;
            this.includeInputDisabled = true;
            this.includeInputChecked = false;
            this.excludeInputDisabled = true;
            this.excludeInputChecked = false;
        }

        console.log(this.addIncomeForm.value.taxApplicable);
        // this.textInputDisabled = !this.textInputDisabled;
        // this.disabledTax = !this.disabledTax;
    }

    calculateTaxByAmount() {
        if (history.state.data) {
            if (
                this.addIncomeForm.value.finalAmount != null ||
                this.updateFormData.totalAmount != null
            ) {
                this.calculateTax(this.taxRate);
            }
        }
    }

    getTaxApplicableValue(event) {
        console.log(event);

        if (event.source._checked == false) {
            this.addIncomeForm.patchValue({ taxApplicable: 0 });
        } else {
            // this.taxInputDisabled = false;
            this.addIncomeForm.patchValue({
                taxApplicable: Number(event.value),
            });
            event.source._checked = true;
        }
        console.log(this.addIncomeForm.value.taxApplicable);
        console.log(this.taxData);
    }

    navigateToHome() {
        this._commonService.navigateToHome();
    }

    // openCollectDialog() {
    //     const dialogRef = this.dialog.open(CollectDialogComponent, {
    //         width: '900px',
    //     });
    //     dialogRef.afterClosed().subscribe((result) => {
    //         console.log(`Dialog result: ${result}`);
    //     });
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

    getCategoryName() {
        this._incomeService
            .getCategory(this.getCategoryNameModal)
            .subscribe((res) => {
                console.log(this._commonService.decryptData(res));
                this.categoryData = this._commonService.decryptData(res);
                console.log(this.categoryData);

                this.changeDetection.detectChanges();
            });
    }

    getTaxName() {
        this._taxService.getTax(this.getTaxNameModal).subscribe((res) => {
            console.log(this._commonService.decryptData(res));
            this.taxData = this._commonService.decryptData(res);
            console.log(this.taxData);

            this.changeDetection.detectChanges();
        });
    }

    openCollectDialog() {
        if (this.addIncomeForm.invalid) {
            for (const control of Object.keys(this.addIncomeForm.controls)) {
                this.addIncomeForm.controls[control].markAsTouched();
            }
            return;
        }

        if (this.addIncomeForm.valid) {
            console.log(this.updateFormData);
            console.log(this.addIncomeForm.value.taxAmount);
            console.log(this.file);
            console.log(this.addIncomeForm.value.file);

            this.addIncomeForm.value.file = this.file;
            // this.addIncomeForm.patchValue({ file: this.file });

            console.log(this.addIncomeForm.value);
            if (history.state.data) {
                // this.addIncomeForm.patchValue({
                //     imageId: this.updateFormData.imageId,
                // });
                console.log(this.addIncomeForm.value);
                // return;

                this.addIncomeForm.value.id = history.state.data;
                console.log(this.addIncomeForm.value);
                const dialogRef = this.dialog.open(CollectDialogComponent, {
                    width: '900px',
                    data: this.addIncomeForm.value,
                });
                dialogRef.afterClosed().subscribe((result) => {
                    if (result) {
                        this.addIncomeForm.reset();
                        this.imageUrl = null;
                        this._route.navigateByUrl('income/manage-income');
                    }
                });
            } else {
                console.log(this.addIncomeForm.value);

                const dialogRef = this.dialog.open(CollectDialogComponent, {
                    width: '900px',
                    data: this.addIncomeForm.value,
                });
                dialogRef.afterClosed().subscribe((result) => {
                    if (result) {
                        this.addIncomeForm.reset();
                        this.imageUrl = null;
                        this._route.navigateByUrl('income/manage-income');
                    }
                });
            }
        }
    }
}
