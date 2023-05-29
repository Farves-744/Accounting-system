import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Output,
    Inject,
    Input,
    EventEmitter,
    ChangeDetectionStrategy,
} from '@angular/core';
import { CommonService } from 'app/shared/services/common.service';
import { getIncomeCategory } from 'app/shared/modals/income-category';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { IncomeService } from 'app/shared/services/income.service';
// import { CompressImageService } from 'app/shared/services/compress-image.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-income-categories-dialog',
    templateUrl: './income-categories-dialog.component.html',
    styleUrls: ['./income-categories-dialog.component.scss']

})
export class IncomeCategoriesDialogComponent {
    env = environment;
    addCategoryForm: FormGroup;
    updateFormData: any = undefined;
    incomeCategory: getIncomeCategory = new getIncomeCategory();
    imageUrl: any;
    fileToUpload: any;
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
        private _incomeService: IncomeService,
        private messageService: MessageService,
        private changeDetection: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<IncomeCategoriesDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: any
    ) { }

    ngOnInit(): void {
        this.userId = this._commonService.getUserId();
        this.addCategoryForm = this._formBuilder.group({
            categoryName: ['', Validators.required],
            categoryType: 0,
            imageId: this.imageId,
            userId: this.userId,
            imageUrl: '',
            deleteImageId: null,
        });
        this.editCategory(this.data);
    }

    get f() {
        return this.addCategoryForm.controls;
    }

    ngAfterContentInit() { }

    editCategory(data: any) {
        if (data) {
            console.log(data);
            this.updateFormData = data;
            this.isEdit = true;
            this.addCategoryForm.patchValue(this.updateFormData);
            console.log(this.addCategoryForm.value.image_url);
            this.imageUrl = this.env.BASE_URL + '/' + data.imageUrl;
            console.log(this.updateFormData);
            console.log(this.url);
        }
    }

    addOrUpdateCategory() {
        if (this.addCategoryForm.invalid) {
            for (const control of Object.keys(this.addCategoryForm.controls)) {
                this.addCategoryForm.controls[control].markAsTouched();
            }
            return;
        }
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
                    this._incomeService
                        .addCategoryImage(this.formData)
                        .subscribe((res) => {
                            console.log(res);
                            let reData = JSON.parse(JSON.stringify(res));
                            this.imageId = reData.imageId;
                            this.addCategoryForm.value.deleteImageId =
                                this.addCategoryForm.value.imageId;
                            this.addCategoryForm.value.imageId = this.imageId;
                            this.updateCategory();
                            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Income updated successfully' });
                            console.log(this.addCategoryForm.value);
                        }, error => {
                            this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Something went wrong' });
                        }
                        );
                } else {
                    console.log(this.addCategoryForm.value);
                    this.updateCategory();
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Income updated successfully', });
                }
            } else {
                console.log(this.file);

                if (this.file != undefined) {

                    this.formatImage(this.file);

                    this._incomeService
                        .addCategoryImage(this.formData)
                        .subscribe((res) => {
                            console.log(res);
                            let reData = JSON.parse(JSON.stringify(res));
                            this.imageId = reData.imageId;
                            this.addCategoryForm.value.imageId = this.imageId;
                            this.addCategory();
                            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Income added successfully' });
                            console.log(this.addCategoryForm.value.imageId);
                        }, error => {
                            this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Something went wrong' });
                        });
                } else {
                    this.addCategory();
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Income added successfully' });
                }
            }
        }
    }

    ngAfterViewInit(): void { }

    onFileDropped(event) {
        this.file = event[0];
        console.log(this.file);
        let reader = new FileReader();
        reader.onload = (event: any) => {
            this.imageUrl = event.target.result;
        };
        reader.readAsDataURL(this.file);
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
        this._incomeService
            .addCategory(this.addCategoryForm.value)
            .subscribe((res) => {
                console.log(this._commonService.decryptData(res));
                this.addCategoryForm.reset();
                this.dialogRef.close(true);
                this.changeDetection.detectChanges();
            }, error => {
                this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Something went wrong' });
            });
    }

    updateCategory() {
        this._incomeService
            .updateCategory(this.addCategoryForm.value)
            .subscribe((res) => {
                // console.log(res);
                console.log(this._commonService.decryptData(res));
                this.addCategoryForm.reset();
                this.dialogRef.close(true);
                this.changeDetection.detectChanges();
            }, error => {
                this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Something went wrong' });
            });
    }

    // closeDialog() {
    //     this.dataEvent.emit('closed');
    // }
    // confirmDelete() {
    //     console.log(this.categoryId);
    // }
}
