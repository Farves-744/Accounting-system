import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Output,
    Inject,
    Input,
    EventEmitter,
} from '@angular/core';
import { CommonService } from 'app/shared/services/common.service';
import { getExpenseCategory } from 'app/shared/modals/expense-category';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ExpenseService } from 'app/shared/services/expense.service';
// import { CompressImageService } from 'app/shared/services/compress-image.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-income-categories-dialog',
    templateUrl: './expense-categories-dialog.component.html',
    styleUrls: ['./expense-categories-dialog.component.scss'],
})
export class ExpenseCategoriesDialogComponent {
    env = environment;
    addCategoryForm: FormGroup;
    updateFormData: any = undefined;
    expenseCategory: getExpenseCategory = new getExpenseCategory();
    imageUrl: any;
    fileToUpload: any;
    imageData: any;
    formData: any;
    userId: any;
    isEdit: boolean = false; // this is for toggle button text add or edit
    imageId: any;
    file: File;
    url: any;

    constructor(
        private _commonService: CommonService,
        // private _compressImageService: CompressImageService,
        private _route: Router,
        private _expenseService: ExpenseService,
        private changeDetection: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<ExpenseCategoriesDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: any
    ) {}

    ngOnInit(): void {
        this.userId = this._commonService.getUserId();
        this.addCategoryForm = this._formBuilder.group({
            categoryName: '',
            categoryType: 1,
            imageId: this.imageId,
            userId: this.userId,
            image_url: '',
            deleteImageId: null,
        });
        this.editCategory(this.data);
    }

    ngAfterContentInit() {}

    editCategory(data: any) {
        if (data) {
            console.log(data);
            this.updateFormData = data;
            this.isEdit = true;
            this.addCategoryForm.patchValue(this.updateFormData);
            console.log(this.addCategoryForm.value.image_url);
            this.imageUrl = this.env.BASE_URL + '/' + data.image_url;
            console.log(this.updateFormData);
            console.log(this.url);
        }
    }

    addOrUpdateCategory() {
        console.log(this.file);
        if (this.addCategoryForm.valid) {
            if (this.data) {
                console.log(this.data);
                // console.log(this.addTaxForm.value);
                this.formatImage(this.file);
                this.addCategoryForm.value.userId = this.userId;
                this.addCategoryForm.value.id = this.data.id;
                this.imageId = this.addCategoryForm.value.imageId;

                if (this.file != undefined) {
                    this._expenseService
                        .addCategoryImage(this.formData)
                        .subscribe((res) => {
                            console.log(res);
                            let reData = JSON.parse(JSON.stringify(res));
                            this.imageId = reData.imageId;
                            this.addCategoryForm.value.deleteImageId =
                                this.addCategoryForm.value.imageId;
                            this.addCategoryForm.value.imageId = this.imageId;
                            this.updateCategory();
                            console.log(this.addCategoryForm.value);
                        });
                } else {
                    console.log(this.addCategoryForm.value);
                    this.updateCategory();
                }
            } else {
                this.formatImage(this.file);
                this._expenseService
                    .addCategoryImage(this.formData)
                    .subscribe((res) => {
                        console.log(res);
                        let reData = JSON.parse(JSON.stringify(res));
                        this.imageId = reData.imageId;
                        this.addCategoryForm.value.imageId = this.imageId;
                        this.addCategory();
                        console.log(this.addCategoryForm.value.imageId);
                    });
            }
        }
    }

    // sendData() {
    //     this.addCategoryForm.value.imageId = this.imageId;
    //     console.log(this.addCategoryForm.value);

    //     this._expenseService
    //         .addCategory(this.addCategoryForm.value)
    //         .subscribe((res) => {
    //             console.log(this._commonService.decryptData(res));
    //             this.addCategoryForm.reset();
    //             this.dialogRef.close(true);
    //             this.changeDetection.detectChanges();
    //         });
    // }

    ngAfterViewInit(): void {}

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

    async formatImage(file: any) {
        console.log(file);
        this.fileToUpload = file;
        this.formData = new FormData();
        // console.log(this.fileToUpload.size);
        //compressing image

        // var fSizeinMb = this.fileToUpload.size / 1024;
        // if (fSizeinMb > 2) {
        // console.log(`Image size Before compressed: ${this.selectedFile.size} bytes.`)
        // console.log(fileNewName);
        this.formData.append('image', this.fileToUpload);
        /*  await this._compressImageService
            .compress(this.fileToUpload)
            .pipe(take(1))
            .subscribe((compressedImage) => {
                this.fileToUpload = compressedImage;
                console.log(this.fileToUpload);
                //set url for image
                // var imgURL = 'USR_IMG';
                // var fileExt = this.fileToUpload.name
                //     .split('?')[0]
                //     .split('.')
                //     .pop();
                // var fileNewName = imgURL + '.' + fileExt;
                //append file to formdata
                // console.log(this.fileToUpload);
                // console.log(fileNewName);
                this.formData.append('image', this.fileToUpload);
                console.log(this.formData);
            }); */
        // }
    }

    addCategory() {
        this._expenseService
            .addCategory(this.addCategoryForm.value)
            .subscribe((res) => {
                console.log(this._commonService.decryptData(res));
                this.addCategoryForm.reset();
                this.dialogRef.close(true);
                this.changeDetection.detectChanges();
            });
    }

    updateCategory() {
        this._expenseService
            .updateCategory(this.addCategoryForm.value)
            .subscribe((res) => {
                // console.log(res);
                console.log(this._commonService.decryptData(res));
                this.addCategoryForm.reset();
                this.dialogRef.close(true);
                this.changeDetection.detectChanges();
            });
    }

    // closeDialog() {
    //     this.dataEvent.emit('closed');
    // }
    // confirmDelete() {
    //     console.log(this.categoryId);
    // }
}
