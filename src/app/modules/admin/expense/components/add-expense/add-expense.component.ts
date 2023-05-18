import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'app/shared/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'environments/environment';
import { GetTax } from 'app/shared/modals/tax';
import { getExpenseCategory } from 'app/shared/modals/expense-category';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from 'app/shared/services/expense.service';
import { TaxService } from 'app/shared/services/tax.service';
import { Router } from '@angular/router';
import { CollectDialogComponent } from '../collect-dialog/collect-dialog.component';

@Component({
    selector: 'app-add-expense',
    templateUrl: './add-expense.component.html',
    styleUrls: ['./add-expense.component.scss'],
})
export class AddExpenseComponent implements OnInit {
    addExpenseForm: FormGroup;
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
    getCategoryNameModal: getExpenseCategory = new getExpenseCategory();
    getTaxNameModal: GetTax = new GetTax();
    updateFormData: any;

    @ViewChild('exclude') exclude: any;
    @ViewChild('include') include: any;

    constructor(
        private _commonService: CommonService,
        private _expenseService: ExpenseService,
        private _taxService: TaxService,
        private _formBuilder: FormBuilder,
        private _route: Router,
        private changeDetection: ChangeDetectorRef,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
        this.userId = this._commonService.getUserId();
        this.addExpenseForm = this._formBuilder.group({
            totalAmount: [null, [Validators.required, Validators.min(100)]],
            description: ['', Validators.minLength(1)],
            taxApplicable: 0,
            taxId: [{ value: null, disabled: true }],
            imageId: this.imageId,
            image_url: '',
            categoryId: [null, Validators.required],
            payments: [[]],
            file: null,
            type: 1,
            taxAmount: null,
            deleteImageId: null,
            actualDate: [null, Validators.required]
        });
        this.getCategoryNameModal.userId = this.userId;
        this.getCategoryName();
        this.getTaxNameModal.userId = this.userId;
        this.getTaxName();
        console.log(this.addExpenseForm.value.taxApplicable);
    }

    get f() {
        return this.addExpenseForm.controls;
    }

    calculateTax(value) {
        console.log(value);

        console.log(this.addExpenseForm.value.taxApplicable);
        if (this.addExpenseForm.value.taxApplicable == 1) {
            this.addExpenseForm.patchValue({
                taxAmount:
                    this.addExpenseForm.value.totalAmount -
                    (this.addExpenseForm.value.totalAmount * 100) /
                    (100 + value),
            });

            console.log(this.addExpenseForm.value.taxAmount);

            this.addExpenseForm.value.totalAmount =
                (this.addExpenseForm.value.totalAmount * 100) /
                (100 + parseInt(value));
            console.log(this.addExpenseForm.value.totalAmount);
            this.addExpenseForm.value.finalAmount =
                this.addExpenseForm.value.totalAmount +
                this.addExpenseForm.value.taxAmount;
            this.finalAmount = this.addExpenseForm.value.finalAmount;

            console.log(this.addExpenseForm.value.finalAmount);
        } else if (this.addExpenseForm.value.taxApplicable == 2) {
            this.addExpenseForm.patchValue({
                taxAmount:
                    this.addExpenseForm.value.totalAmount -
                    (this.addExpenseForm.value.totalAmount * 100) /
                    (100 + value),
            });

            console.log(this.addExpenseForm.value.taxAmount);

            this.addExpenseForm.value.totalAmount =
                this.addExpenseForm.value.totalAmount;
            this.addExpenseForm.value.finalAmount = Math.round(
                this.addExpenseForm.value.totalAmount +
                this.addExpenseForm.value.taxAmount
            );
            this.finalAmount = this.addExpenseForm.value.finalAmount;

            console.log(this.addExpenseForm.value.finalAmount);
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
        console.log(this.addExpenseForm.value.taxAmount);
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

            this.addExpenseForm.value.userId = this.userId;
            this.addExpenseForm.value.id = history.state.data;
            console.log(this.addExpenseForm.value);

            this._expenseService
                .getExpenseById(this.addExpenseForm.value)
                .subscribe((res) => {
                    console.log(this._commonService.decryptData(res));

                    this.updateFormData = this._commonService.decryptData(res);

                    console.log(this.updateFormData);

                    this.addExpenseForm.patchValue(this.updateFormData);
                    this.taxRate = this.updateFormData.taxId;
                    console.log(this.taxRate);
                    this.calculateTaxBySelect(this.taxRate);

                    this.addExpenseForm.value.id = history.state.data;
                    this.imageUrl =
                        this.env.BASE_URL + '/' + this.updateFormData.imageUrl;
                    console.log(this.imageUrl);
                    if (this.updateFormData.taxApplicable == 1) {
                        // this.textInputDisabled = false;
                        // console.log(this.textInputDisabled);

                        this.includeInputDisabled = false;
                        this.excludeInputDisabled = false;
                        this.includeInputChecked = true;

                        this.addExpenseForm.controls.taxApplicable.enable();
                        // this.exclude.disabled = false;
                        // this.addExpenseForm.value.taxApplicable =
                        //     this.updateFormData.taxApplicable;
                        // this.finalAmount = this.updateFormData.totalAmount;
                    }
                    if (
                        this.updateFormData.taxApplicable == 1 ||
                        this.updateFormData.taxApplicable == 2
                    ) {
                        this.showFinal = true;

                        this.addExpenseForm.controls.taxId.enable();
                        // this.textInputDisabled = false;
                        this.includeInputDisabled = false;
                        this.excludeInputDisabled = false;
                        // this.include.disabled = false;
                        // this.include.checked = true;

                        // this.addExpenseForm.value.taxApplicable =
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
            this.addExpenseForm.patchValue({ taxApplicable: 1 });
            this.addExpenseForm.controls.taxId.enable();

            this.includeInputDisabled = false;
            this.excludeInputDisabled = false;
            this.includeInputChecked = true;

            // this.taxInputDisabled = false;
            // this.include.disable = false;

            if (this.addExpenseForm.value.finalAmount != null) {
                this.calculateTax(this.taxRate);
            }
        } else {
            this.showFinal = false;
            this.addExpenseForm.patchValue({ taxApplicable: 0 });
            console.log(this.addExpenseForm.value.taxApplicable);
            // this.taxInputDisabled = true;
            this.includeInputDisabled = true;
            this.includeInputChecked = false;
            this.excludeInputDisabled = true;
            this.excludeInputChecked = false;

            // this.exclude.checked = false;
            this.addExpenseForm.controls.taxId.disable();
            this.addExpenseForm.value.totalAmount =
                this.addExpenseForm.value.totalAmount;
            console.log(this.addExpenseForm.value.totalAmount);

            this.addExpenseForm.value.finalAmount =
                this.addExpenseForm.value.totalAmount;
            console.log(this.addExpenseForm.value.finalAmount);
            this.addExpenseForm.value.taxAmount = null;

            console.log(this.addExpenseForm.value.taxAmount);
        }

        if (this.addExpenseForm.value.taxApplicable == 0) {
            // this.textInputChecked = false;
            this.includeInputDisabled = true;
            this.includeInputChecked = false;
            this.excludeInputDisabled = true;
            this.excludeInputChecked = false;
        }

        console.log(this.addExpenseForm.value.taxApplicable);
        // this.textInputDisabled = !this.textInputDisabled;
        // this.disabledTax = !this.disabledTax;
    }

    calculateTaxByAmount() {
        if (history.state.data) {
            if (
                this.addExpenseForm.value.finalAmount != null ||
                this.updateFormData.totalAmount != null
            ) {
                this.calculateTax(this.taxRate);
            }
        }
    }

    getTaxApplicableValue(event) {
        console.log(event);

        if (event.source._checked == false) {
            this.addExpenseForm.patchValue({ taxApplicable: 0 });
        } else {
            // this.taxInputDisabled = false;
            this.addExpenseForm.patchValue({
                taxApplicable: Number(event.value),
            });
            event.source._checked = true;
        }
        console.log(this.addExpenseForm.value.taxApplicable);
        console.log(this.taxData);
    }

    navigateToHome() {
        this._commonService.navigateToHome();
    }

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
        this._expenseService
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
        if (this.addExpenseForm.invalid) {
            for (const control of Object.keys(this.addExpenseForm.controls)) {
                this.addExpenseForm.controls[control].markAsTouched();
            }
            return;
        }
        if (this.addExpenseForm.valid) {
            console.log(this.updateFormData);
            console.log(this.addExpenseForm.value.taxAmount);
            console.log(this.file);
            console.log(this.addExpenseForm.value.file);

            this.addExpenseForm.value.file = this.file;
            // this.addExpenseForm.patchValue({ file: this.file });

            console.log(this.addExpenseForm.value);

            if (history.state.data) {
                // this.addExpenseForm.patchValue({
                //     imageId: this.updateFormData.imageId,
                // });
                console.log(this.addExpenseForm.value);
                // return;

                this.addExpenseForm.value.id = history.state.data;
                console.log(this.addExpenseForm.value);
                const dialogRef = this.dialog.open(CollectDialogComponent, {
                    width: '900px',
                    data: this.addExpenseForm.value,
                });

                dialogRef.afterClosed().subscribe((result) => {
                    if (result) {
                        this.addExpenseForm.reset();
                        this.imageUrl = null;

                        setTimeout(() => {
                            this._route.navigateByUrl('expense/manage-expense');
                        }, 1000)
                    }
                });
            } else {
                console.log(this.addExpenseForm.value);

                const dialogRef = this.dialog.open(CollectDialogComponent, {
                    width: '900px',
                    data: this.addExpenseForm.value,
                });

                dialogRef.afterClosed().subscribe((result) => {
                    if (result) {
                        this.addExpenseForm.reset();
                        this.imageUrl = null;

                        setTimeout(() => {
                            this._route.navigateByUrl('expense/manage-expense');
                        }, 1000)
                    }
                });
            }
        }

    }
}
