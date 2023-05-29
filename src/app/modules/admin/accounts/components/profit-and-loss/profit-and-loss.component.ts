import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'app/app.component';
import {
    GetProfitAndLoss,
    ProfitAndLossData,
} from 'app/shared/modals/accounts';
import { AccountService } from 'app/shared/services/account.service';
import { CommonService } from 'app/shared/services/common.service';

@Component({
    selector: 'app-profit-and-loss',
    templateUrl: './profit-and-loss.component.html',
    styleUrls: ['./profit-and-loss.component.scss']

})
export class ProfitAndLossComponent implements OnInit {
    dashboardAccess: any

    constructor(
        private router: Router,
        private _commonService: CommonService,
        private _accountService: AccountService,
        private changeDetection: ChangeDetectorRef
    ) {
        this.dashboardAccess = (AppComponent.checkUrl("dashboards"))
    }

    userId: any;
    profitAndLossData: ProfitAndLossData;

    getProfitAndLossModal: GetProfitAndLoss = new GetProfitAndLoss();

    navigateToHome() {
        this._commonService.navigateToHome();
    }

    ngOnInit(): void {
        this.userId = this._commonService.getUserId();
        this.getProfitAndLoss();
    }

    dateFilter() {
        this.getProfitAndLoss();
    }

    clearDate() {
        (this.getProfitAndLossModal.startDate = null),
            (this.getProfitAndLossModal.endDate = null),
            this.getProfitAndLoss();
    }

    getProfitAndLoss() {
        console.log(this.getProfitAndLossModal);

        this.getProfitAndLossModal.userId = this.userId;

        this._accountService
            .getProfitAndLoss(this.getProfitAndLossModal)
            .subscribe((res) => {
                this.profitAndLossData = this._commonService.decryptData(res);
                console.log(this.profitAndLossData);

                this.changeDetection.detectChanges();
            });
    }
}
