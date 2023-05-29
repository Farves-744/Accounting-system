import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from 'environments/environment';

import jsPDF from "jspdf";
import "jspdf-autotable";
import { DatePipe } from '@angular/common';
import { TableUtil } from 'app/shared/tableUtil';
import { AppComponent } from 'app/app.component';
import { GetLogs } from 'app/shared/modals/logs';
import { LogService } from 'app/shared/services/log.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  url = environment.BASE_URL;
  getLogsModal: GetLogs = new GetLogs()
  logsDate: any;

  cols: any[];
  exportColumns;
  dashboardAccess: any
  logsData: any

  constructor(
    private _commonService: CommonService,
    private _logService: LogService,
    public dialog: MatDialog,
    private router: Router,
    private datePipe: DatePipe,
    private changeDetection: ChangeDetectorRef
  ) { this.dashboardAccess = (AppComponent.checkUrl("dashboards")) }

  displayedColumns: string[] = [
    'position',
    'userName',
    'actions',
    'description',
    'date',
    'time',
  ];

  navigateToHome() {
    this._commonService.navigateToHome();
  }

  exportPdf() {
    const doc = new jsPDF('p', 'pt', 'a4');
    console.log(this.logsData);
    let rows = []
    this.logsData.forEach((element, i) => {
      var temp = [i + 1, element.userName, element.action, element.description ? element.description : '-', this.datePipe.transform(new Date(element.actionDate), 'dd-MM-yyyy'), this.datePipe.transform(new Date(element.actionDate), 'hh:mm:ss a')];
      rows.push(temp);
    });
    doc['autoTable'](this.exportColumns, rows);
    doc.save("Logs.pdf");
  }

  exportExcel() {
    var rows = [];
    const date = new Date();
    this.logsData.forEach((element, i) => {
      var temp = [i + 1, element.userName, element.action, element.description ? element.description : '-', this.datePipe.transform(new Date(element.actionDate), 'dd-MM-yyyy'), this.datePipe.transform(new Date(element.actionDate), 'hh:mm:ss a')];
      rows.push(temp);
    });
    TableUtil.exportArrayToExcel(rows, "Logs " + this.datePipe.transform(date, 'dd-MMM-yyyy'));
  }

  ngOnInit(): void {
    this.getLogsModal.userId = this._commonService.getUserId();
    this.getLogs()

    this.cols = [
      { field: "sn", header: "SN" },
      { field: "userName", header: "USER NAME" },
      { field: "actions", header: "ACTIONS" },
      { field: "description", header: "DESCRIPTION" },
      { field: "createdAt", header: "DATE" },
      { field: "time", header: "TIME" },
    ];

    this.exportColumns = this.cols.map(col => ({
      title: col.header,
      dataKey: col.field
    }));
  }

  applyFilter() {
    this.dataSource.filter = '' + Math.random();
  }

  searchLogs(event: any) {
    this.getLogsModal.search =
      event.target.value === '' ? null : event.target.value;
    this.getLogs();
  }

  getLogs() {
    console.log(this.getLogsModal);

    this._logService
      .getLogs(this.getLogsModal)
      .subscribe((res) => {
        console.log(this._commonService.decryptData(res));

        this.dataSource = new MatTableDataSource(
          this._commonService.decryptData(res)
        );

        this.logsData = this._commonService.decryptData(res)

        this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        this.changeDetection.detectChanges();
      });
  }

  dateFilter() {
    this.getLogs();
  }

  clearDate() {
    (this.getLogsModal.startDate = null),
      (this.getLogsModal.endDate = null),
      this.getLogs();
  }

}
