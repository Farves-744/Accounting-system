import { Component, OnInit, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApexOptions } from 'apexcharts';
import { DashboardData, GraphModal } from 'app/shared/modals/dashboard';
import { CommonService } from 'app/shared/services/common.service';
import { DashboardService } from 'app/shared/services/dashboard.service';
import { formatDate } from '@angular/common';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: MatTableDataSource<any>;
    cashflowChart: ApexOptions = {};
    profitAndLossChart: ApexOptions = {};
    dashboardModal: DashboardData = new DashboardData();
    graphModal: GraphModal = new GraphModal();
    dashboardCardsData: any;
    duration: any;
    startDate: any;
    endDate: any;
    areaGraphData: any;
    polarGraphData: any;
    formattedLabels: any;
    // static urlList: any = []

    constructor(
        private _router: Router,
        private _commonService: CommonService,
        private _dashboardService: DashboardService,
        private changeDetection: ChangeDetectorRef,
        private _authService: AuthService
    ) {
        // if (localStorage.getItem('privileges')) {
        //     var menusFilterList = localStorage.getItem('privileges').toString()
        //     DashboardComponent.urlList = menusFilterList.split(',')
        // }
        // console.log(DashboardComponent.urlList);
    }

    displayedColumns: string[] = [
        'position',
        'holderName',
        'paymentMode',
        'date',
        'creditAmount',
        'debitAmount',
        'incluExclu',
        'taxRate',
        'taxAmount',
        'description',
        'runningBalance',
    ];

    filterBy = [
        { name: 'Monthly', id: 1 },
        { name: 'Yearly', id: 2 },
    ];

    // static checkUrl(option) {
    //     for (let roleOption of DashboardComponent.urlList)
    //         if (option == roleOption)
    //             return true
    //     return false;
    // }

    ngOnInit(): void {
        this.dashboardModal.userId = this._commonService.getUserId();
        this.graphModal.userId = this._commonService.getUserId();

        this.getGraphData(1);

        this.getDashboardTransactions();
        this.getDashboardCards();
    }

    getDashboardTransactions() {
        // console.log(this.graphModal);
        this._dashboardService
            .getDashboardTransactions(this.graphModal)
            .subscribe((res) => {
                // console.log(this._commonService.decryptData(res));
                this.dataSource = new MatTableDataSource(
                    this._commonService.decryptData(res)
                );
                this.dataSource.paginator = this.paginator;
                this.changeDetection.detectChanges();
            });
    }

    filterByData(event) {
        if (event == 1) {
            this.getGraphData(1);
        } else {
            this.getGraphData(2);
        }
    }

    getGraphData(value) {
        this.dashboardModal.duration = value;
        // console.log(this.dashboardModal);

        if (value == 1) {
            const date = new Date();
            const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            const lastDay = new Date(
                date.getFullYear(),
                date.getMonth() + 1,
                0
            );
            this.dashboardModal.startDate = firstDay;
            this.dashboardModal.endDate = lastDay;
            // console.log(this.dashboardModal);
            this._dashboardService
                .getAreaGraphData(this.dashboardModal)
                .subscribe((res) => {
                    // console.log(this._commonService.decryptData(res));
                    this.areaGraphData = this._commonService.decryptData(res);
                    this.areaGraphData.graphChart.graphData.type = 'area';
                    // console.log(this.areaGraphData.graphChart.graphData.type);
                    // console.log(this.areaGraphData.graphChart.date);

                    if (this.areaGraphData.graphChart.duration == 1) {
                        this.areaGraphData.graphChart.date =
                            this.areaGraphData.graphChart.date.map((date) =>
                                this.formatDateLabel(date)
                            );
                        // console.log(this.areaGraphData.graphChart.date);
                    }
                    if (this.areaGraphData.graphChart.duration == 2) {
                        this.areaGraphData.graphChart.date =
                            this.areaGraphData.graphChart.date.map((date) =>
                                this.formatMonthLabel(date)
                            );
                        // console.log(this.areaGraphData.graphChart.date);
                    }
                    setTimeout(() => {
                        this.getChartData();
                    }, 100);
                    this.changeDetection.markForCheck();
                    // this.changeDetection.detectChanges();
                }, error => {
                    // console.log(error.status);

                    if (error.status == 603) {
                        // location.reload();
                        // this.getGraphData(1)
                        // localStorage.clear()
                        // this._router.navigateByUrl('sign-in')
                    }
                });

            this._dashboardService
                .getPolarGraphData(this.dashboardModal)
                .subscribe((res) => {
                    this.polarGraphData = this._commonService.decryptData(res);
                    // console.log(this.polarGraphData);
                    // console.log(this.polarGraphData.graphChart.date);
                    this.polarGraphData.graphChart.graphData.type = 'radar';

                    if (this.polarGraphData.graphChart.duration == 1) {
                        this.polarGraphData.graphChart.date =
                            this.polarGraphData.graphChart.date.map((date) =>
                                this.formatDateLabel(date)
                            );
                        // console.log(this.polarGraphData.graphChart.date);
                    }
                    if (this.areaGraphData.graphChart.duration == 2) {
                        this.polarGraphData.graphChart.date =
                            this.polarGraphData.graphChart.date.map((date) =>
                                this.formatMonthLabel(date)
                            );
                        // console.log(this.polarGraphData.graphChart.date);
                    }
                    // this.changeDetection.detectChanges();
                    setTimeout(() => {
                        this.getChartData();
                    }, 100);
                    this.changeDetection.markForCheck();
                });
        }
        if (value == 2) {
            const currentYear = new Date().getFullYear();
            const firstDateOfYear = new Date(currentYear, 0, 1);
            const lastDateOfYear = new Date(currentYear, 11, 31);

            this.dashboardModal.startDate = firstDateOfYear;
            this.dashboardModal.endDate = lastDateOfYear;
            // console.log(this.dashboardModal);

            this._dashboardService
                .getAreaGraphData(this.dashboardModal)
                .subscribe((res) => {
                    this.areaGraphData = this._commonService.decryptData(res);
                    // console.log(this.areaGraphData);
                    // console.log(this.areaGraphData.graphChart.date);
                    this.areaGraphData.graphChart.graphData.type = 'area';

                    // console.log(this.polarGraphData.graphChart.graphData.type);

                    if (this.areaGraphData.graphChart.duration == 1) {
                        this.areaGraphData.graphChart.date =
                            this.areaGraphData.graphChart.date.map((date) =>
                                this.formatDateLabel(date)
                            );
                        // console.log(this.areaGraphData.graphChart.date);
                    }
                    if (this.areaGraphData.graphChart.duration == 2) {
                        this.areaGraphData.graphChart.date =
                            this.areaGraphData.graphChart.date.map((date) =>
                                this.formatMonthLabel(date)
                            );
                        // console.log(this.areaGraphData.graphChart.date);
                    }

                    // this.changeDetection.detectChanges();
                    setTimeout(() => {
                        this.getChartData();
                    }, 100);
                    this.changeDetection.markForCheck();
                });

            this._dashboardService
                .getPolarGraphData(this.dashboardModal)
                .subscribe((res) => {
                    this.polarGraphData = this._commonService.decryptData(res);
                    // console.log(this.polarGraphData);
                    // console.log(this.polarGraphData.graphChart.date);
                    this.polarGraphData.graphChart.graphData.type = 'radar';

                    if (this.polarGraphData.graphChart.duration == 1) {
                        this.polarGraphData.graphChart.date =
                            this.polarGraphData.graphChart.date.map((date) =>
                                this.formatDateLabel(date)
                            );
                        // console.log(this.polarGraphData.graphChart.date);
                    }
                    if (this.areaGraphData.graphChart.duration == 2) {
                        this.polarGraphData.graphChart.date =
                            this.polarGraphData.graphChart.date.map((date) =>
                                this.formatMonthLabel(date)
                            );
                        // console.log(this.polarGraphData.graphChart.date);
                    }
                    // this.changeDetection.detectChanges();
                    setTimeout(() => {
                        this.getChartData();
                    }, 100);
                    this.changeDetection.markForCheck();
                });
        }
    }

    getDashboardCards() {
        this._dashboardService
            .getDashboardCards(this.graphModal)
            .subscribe((res) => {
                // console.log(this._commonService.decryptData(res));
                this.dashboardCardsData = this._commonService.decryptData(res);

                this.changeDetection.detectChanges();
            });
    }

    goToTransactions() {
        this._router.navigateByUrl('accounts/transactions');
    }

    dateFilter() {
        this.graphModal.startDate = this.startDate;
        this.graphModal.endDate = this.endDate;
        this.getDashboardTransactions();
        this.getDashboardCards();
    }

    applyFilter() {
        this.dataSource.filter = '' + Math.random();
    }

    clearDate() {
        this.startDate = null;
        this.endDate = null;
        this.graphModal.startDate = null;
        this.graphModal.endDate = null;
        this.getDashboardTransactions();
        this.getDashboardCards();
        // console.log(this.graphModal);
    }

    formatDateLabel(date: Date): string {
        return formatDate(date, 'd', 'en-US');
    }

    formatMonthLabel(month: string): string {
        const monthNumber = parseInt(month, 10);
        const date = new Date(2000, monthNumber - 1, 1);
        const formattedMonth = date.toLocaleString('en-US', { month: 'short' });
        return formattedMonth;
    }

    getChartData() {
        this.cashflowChart = {
            chart: {
                animations: {
                    enabled: true,
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '350px',
                toolbar: {
                    show: true,
                },
                zoom: {
                    enabled: false,
                },
                type: 'area',
                sparkline: {
                    enabled: false,
                },
            },
            labels: this.areaGraphData.graphChart.date,
            dataLabels: {
                enabled: false,
            },
            legend: {
                show: true,
                position: 'top',
            },
            colors: ['#2D98FF', '#FF417C'],
            series: this.areaGraphData?.graphChart?.graphData,
            stroke: {
                curve: 'smooth',
                lineCap: 'round',
                dashArray: [8, 8],
                width: 3,

                colors: ['#2D98FF', '#FF417C'],
            },
            tooltip: {
                followCursor: false,
                theme: 'light',
            },
            // title: {
            //     text: 'Cashflow',
            // },
            xaxis: {
                axisBorder: {
                    show: true,
                },
                axisTicks: {
                    color: '#000',
                },
                labels: {
                    style: {
                        colors: '#000',
                    },
                },
                tooltip: {
                    enabled: false,
                },
            },
            yaxis: {
                // show: false,
                labels: {
                    offsetX: -16,
                    style: {
                        colors: '#000',
                    },
                },
            },
        };

        this.profitAndLossChart = {
            series: this.polarGraphData?.graphChart?.graphData,
            chart: {
                height: '350px',
                type: 'radar',
            },
            dataLabels: {
                enabled: false,
            },
            plotOptions: {
                radar: {
                    size: 140,
                    polygons: {
                        //   strokeColor: "#e9e9e9",
                        fill: {
                            colors: ['#f8f8f8', '#fff'],
                        },
                    },
                },
            },
            // title: {
            //     text: 'Profit and Loss',
            // },
            colors: ['#FF709D', '#64B3FF'],
            markers: {
                size: 4,
                colors: ['#FF709D', '#64B3FF'],
                // strokeColors: ['#000'],
                strokeColors: ['#64B3FF', '#FF709D'],
                strokeWidth: 2,
            },
            // tooltip: {
            //   y: {
            //     formatter: function(val) {
            //       return val;
            //     }
            //   }
            // },

            tooltip: {
                theme: 'light',
                // y: {
                //     formatter: (val: number): string => `${val}%`,
                // },
            },
            fill: {
                opacity: 0.3,
                // colors: ["#000", "green"]
            },
            stroke: {
                width: 2,
            },

            xaxis: {
                categories: this.polarGraphData.graphChart.date,
            },

            yaxis: {
                show: false,
                // tickAmount: 0,
                // labels: {
                //     formatter: function(val, i) {
                //       if (i % 2 === 0) {
                //         return val;
                //       } else {
                //         return "";
                //       }
                //     }
                // },
            },
        };
    }
}
