import {AfterViewInit, Component, OnInit} from '@angular/core';
import {WebSocketConfig} from "../websocket/WebSocketConfig";
import {DowntimeInfoService} from "../service/downtime-info.service";
import {WebsiteDetails} from "../model/WebsiteDetails";
import {UptimeStatus} from "../model/UptimeStatus";

import {UserStorageService} from "../service/user-storage.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

import Chart from 'chart.js/auto';
import { DatePipe } from '@angular/common';
import {DownTimeSummary} from "../model/DownTimeSummary";
import 'chartjs-adapter-moment';
import * as moment from 'moment';
import {DownTime} from "../model/DownTime";
import {Moment} from "moment";
import {WebsiteService} from "../service/website.service";



@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit , AfterViewInit{

  webSocketConfig: WebSocketConfig;
  websiteList: WebsiteDetails[]= [];

  currentTab:string='Real Time Chart';

  //history part
  downtimeHistory:DownTimeSummary[]=[];
  historyChart:Chart;

  totalUptimePercentage:number=0;

  historyPieChart:Chart;

  lineChartTodayHistory:Chart;
  downtimeList:DownTime[];
  todayDowntimeChartData: any[]=[];


  //real time chart
  chartData:number[]= [];
  charLabel:string='';
  chartLabels:string[]=[];
  realTimeChart:Chart;

  //websocket real time data store
   dataMap:Map<number,number[]> = new Map();
   labelMap:Map<number, string[]>= new Map();

   currentWebsite:WebsiteDetails;

  constructor(private downtimeInfoService: DowntimeInfoService, private tokenStorage:UserStorageService, private websiteService:WebsiteService,
              private router:Router, private snackBar:MatSnackBar, private datePipe:DatePipe) { }

   ngOnInit(): void {
    this.getWebsiteListAndSubscribe();
  }
  //initialize real time chart after view init
  ngAfterViewInit():void{

    const ctx = document.getElementById('chartId');
    //console.log(ctx);

    // @ts-ignore
    this.realTimeChart= new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: this.charLabel,
          data: this.chartData,
          borderWidth: 1,
          borderColor:'#9FF4CE',
          pointBackgroundColor:'#19DF85',
          backgroundColor:'#0AD277'
        }]
      },
      options: {

        scales: {
          y: {
            ticks: {
              callback:function(value, index, ticks) {
                if(value==1)
                return 'UP';
                else if(value==0)
                  return 'DOWN';
                else return '';
              }
            },
            beginAtZero: true,
            max:2,
          },
        /*  x: {
            type: 'time',
            time: {
              // Luxon format string
              tooltipFormat: 'DD T',
              minUnit:'second',

            },
            min:startOfDay,
            max:endDate
          }*/
        }
      }
    });

    //this.createChart( document.getElementById('myChartDemo'));
  }

  //region fetch website list and establish socket connection
  getWebsiteListAndSubscribe(){
    this.webSocketConfig = new WebSocketConfig(this);
    this.getWebsiteList()
      .then(()=> {
        if(this.websiteList.length>0){
          this.connect(this.websiteList);
          this.currentWebsite=this.websiteList[0];
          this.charLabel=this.currentWebsite.url.toString();
        }
      });
  }

  getWebsiteList() {
    return this.websiteService.getWebsiteList().toPromise()
      .then(resp => {
      console.log("in get list....");
      if (resp.body) {
        for (const data of resp.body) {
          this.websiteList.push(data);
        }
      }
    },
      error => console.log(error))
      .then();

  }
  //endregion

  // region Websocket related functions
  connect(websiteList: WebsiteDetails[]){
    this.webSocketConfig._connect(websiteList);
  }

  disconnect(){
    this.webSocketConfig._disconnect();
  }

  /*sendMessage(){
    this.webSocketConfig._send();
  }*/

  handleMessage(message){
    const now = new Date().getTime();
    let startOfDay = now - (now % 86400000);

    message=message.replaceAll('\\','');
    message=message.substring(1, message.length-1);
    let uptimeStatus= (JSON.parse(message)) as UptimeStatus;
    let statusList= this.dataMap.get(uptimeStatus.webId);
    let labelList= this.labelMap.get(uptimeStatus.webId);

    if(statusList && labelList){

      statusList.push( uptimeStatus.down ? 0:1);
      // @ts-ignore
      labelList.push(this.datePipe.transform(uptimeStatus.time,'HH:mm:ss') );

      this.dataMap.set(uptimeStatus.webId, statusList);
      // @ts-ignore
      this.labelMap.set(uptimeStatus.webId, labelList);

      if(uptimeStatus.webId==this.currentWebsite.webId){
        if(this.dataMap.get(uptimeStatus.webId)!=undefined)
          {
            this.refreshChart(uptimeStatus.webId);
          }
      }
    }else{
      // @ts-ignore
      let statusList:number[] =[];
      let labelList:string[]=[];

      statusList.push(uptimeStatus.down ? 0:1);
      // @ts-ignore
      labelList.push(this.datePipe.transform(uptimeStatus.time,'HH:mm:ss'));
      this.dataMap.set(uptimeStatus.webId, statusList);
      // @ts-ignore
      this.labelMap.set(uptimeStatus.webId, labelList);

      if(this.dataMap.get(uptimeStatus.webId)!=undefined)
      { // @ts-ignore
        this.refreshChart(uptimeStatus.webId);
      }
    }

    if(this.todayDowntimeChartData){
      console.log(  "---------------------"+new Date(uptimeStatus.time));
      if(this.currentWebsite.webId==uptimeStatus.webId){
          this.todayDowntimeChartData.push({
            x: moment().utc().toDate(),
            y: uptimeStatus.down ? 0:1
          });

        this.refreshLineChartTodayHistory();
      }
    }

  }
  //endregion

  //region chart related functions
  refreshChart(webId){
    // @ts-ignore
    this.chartData=this.dataMap.get(webId);
    // @ts-ignore
    this.chartLabels=this.labelMap.get(webId);
    // @ts-ignore
    this.charLabel= this.currentWebsite.url;
    this.realTimeChart.data.datasets[0].data = this.chartData;
    // @ts-ignore
    this.realTimeChart.data.labels=this.chartLabels;
    this.realTimeChart.data.datasets[0].label=this.charLabel;
    this.realTimeChart.update();


  }
  refreshLineChartTodayHistory(){
    if( this.lineChartTodayHistory){
      this.lineChartTodayHistory.data.datasets[0].data=this.todayDowntimeChartData;
      this.lineChartTodayHistory.update();
    }
  }
  showDefaultChart(){
    this.realTimeChart.data.datasets[0].data=[];
    this.realTimeChart.data.datasets[0].label='';
    this.realTimeChart.data.labels=[];
    this.realTimeChart.update();
  }

  createHistoryBarChart(){
    let historyChartLabels= [];
    let historyChartData=[];
    this.totalUptimePercentage=0;
    this.downtimeHistory.forEach(downtimeData => {
      // @ts-ignore
      historyChartLabels.push(this.datePipe.transform(downtimeData.date,'dd-MM-yyyy'));
      // @ts-ignore
      historyChartData.push(downtimeData.totalUpTime);
      this.totalUptimePercentage=this.totalUptimePercentage+downtimeData.uptimePercentage;
      console.log(downtimeData.totalUpTime);
    });
    if(this.downtimeHistory.length>0){
      this.totalUptimePercentage=this.totalUptimePercentage/this.downtimeHistory.length;
    }else{
      this.totalUptimePercentage=100;
    }

    const ctx = document.getElementById('historyChartId');
    if( this.historyChart)
      this.historyChart.destroy();
    // @ts-ignore
    this.historyChart= new Chart(ctx, {
      type: 'bar',
      data: {
        labels: historyChartLabels,
        datasets: [{
          label: this.charLabel,
          data: historyChartData,
          borderWidth: 1,
          borderColor: '#6FF18A',
          backgroundColor:'RGBA(111,241,134,0.2)'
        }]
      },
      options: {
        barThickness: 30,
        scales: {
          y: {
            beginAtZero: true,
            max:84600,
          }
        },
      plugins:{
        tooltip:{
          callbacks:{
            title: function (context){
              return 'Date: ' +context[0].label;
            },
            label: function (context){
              return 'Total uptime: '+ context.formattedValue + ' sec';
            },
            footer:function (context){
              console.log(context);
              const activePercentage=((context[0].parsed.y/86400)*100).toFixed(2);
              return activePercentage + ' % Active';
            }
          }
        }
      }  },

    });

  }

  createHistoryPiChart(){
    const ctx = document.getElementById('historyUptimePercentagePiChart');
    if( this.historyPieChart)
      this.historyPieChart.destroy();
    // @ts-ignore
    this.historyPieChart= new Chart(ctx, {
      type: 'pie',
      data: {

        labels: ['Up', 'Down'],
        datasets: [{
          //label: this.charLabel,
          data: [ this.totalUptimePercentage,  100.00-this.totalUptimePercentage],
          backgroundColor:['#0AD234','#D2190A']

        }]
      },
      options:{
        plugins: {
          title: {
            display: true,
            text: this.totalUptimePercentage.toFixed(4) + '% Active'
          }
        },
        tooltips: {
          // Customize the tooltip text
          callbacks: {
            label: function(tooltipItem, data) {
              return data+'%';
            }
          }
        }
      }

    });
  }

  createLineChartTodayHistory(){
    this.downtimeInfoService.getTodayDownTimeHistoryToday(this.currentWebsite.webId).subscribe(data=>{
      this.downtimeList= data.body as DownTime[];
      this.todayDowntimeChartData=[];

      let currentDate = moment().utc().startOf('day');
      console.log(currentDate.toDate()+"=======================");
      let endDate = moment().utc();
      console.log(endDate+"=======================");
      for (let m = currentDate; m.isSameOrBefore(endDate); m.add(5, 'minutes')) {
        if(this.checkIsDown(m))
          this.todayDowntimeChartData.push({
            x: m.toDate(),
            y: 0
          });
        else
          this.todayDowntimeChartData.push({
            x: m.toDate(),
            y: 1
          });
      }
      console.log( this.todayDowntimeChartData);
      if(this.lineChartTodayHistory)
        this.lineChartTodayHistory.destroy();
      console.log(this.lineChartTodayHistory);
      //create chart
      const ctx = document.getElementById('todayHistoryChart');
      // @ts-ignore
      this.lineChartTodayHistory= new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: this.charLabel,
            data: this.todayDowntimeChartData,
            borderWidth: 2,
            borderColor:'#9FF4CE',
            pointBackgroundColor:'#19DF85',
            backgroundColor:'#0AD277',
            radius: 0
          }]
        },
        options: {
          scales: {
            y: {
              ticks: {
                callback:function(value, index, ticks) {
                  if(value==1)
                    return 'UP';
                  else if(value==0)
                    return 'DOWN';
                  else return '';
                }
              },
              beginAtZero: true,
              max:2,
            },
            x: {
              type: 'time',
              time: {
                // Luxon format string
                //tooltipFormat: 'DD T',
                //minUnit:'second',
              },
            }
          }
        }
      });

    });

  }

  checkIsDown(currMoment:Moment){
    let isDown:boolean=false;
    this.downtimeList.forEach(downtime=>{
      //console.log('=========='+currMoment.toDate()+"        "+ downtime.downTimeId+"     "+new Date(downtime.startTime)+'    '+ new Date(downtime.endTime));
      let endTime;
      if(downtime.endTime) endTime = downtime.endTime;
      else { // @ts-ignore
        endTime= moment().utc();
      }
      //console.log("----------------------------------"+endTime);
      //console.log("----------------------------------"+currMoment.isBetween( downtime.startTime, endTime));
      if(currMoment.isBetween( downtime.startTime, endTime))
        isDown=true;
    });
    return isDown;
  }
  //endregion

  //region List edit delete
  removeWebsite(webId){
    this.websiteService.removeWebsite( webId).subscribe(data=>{
          this.snackBar.open("Website Deleted successfully", '',{duration:3000});
          this.removeWebsiteFromList(webId);
    },error => {

    });
  }

  removeWebsiteFromList(webId){
    let removedWebsiteIndex;
    for(const [key, website] of this.websiteList.entries()){
      if(website.webId==webId){
        removedWebsiteIndex=key;
        break;
      }
    }
    this.websiteList.splice(removedWebsiteIndex,1);
    if(this.websiteList[0]) {
      this.currentWebsite = this.websiteList[0];
      this.refreshChart(this.currentWebsite.webId);
    }
    else{
      this.currentWebsite=new WebsiteDetails();
      this.showDefaultChart();
    }

  }

  edit(webId){
    this.router.navigate(['/update-website', {webId: webId}]);
  }

  onListItemClick(websiteDetails:WebsiteDetails){
    this.currentWebsite=websiteDetails;
    this.charLabel=websiteDetails.url.toString();

    if(this.currentTab=='Real Time Chart')
      this.refreshChart(websiteDetails.webId);
    else if(this.currentTab=='History')
      this.getWebsiteDayWiseDownTimeHistory();
    else if(this.currentTab=='Today History')
      this.createLineChartTodayHistory();
  };
  //endregion

  //region website history
  onTabClick(event){
    if(event.tab.textLabel=="History"){
      this.currentTab='History';
      this.getWebsiteDayWiseDownTimeHistory();
    }else if(event.tab.textLabel=="Today History"){
      this.createLineChartTodayHistory();
      this.currentTab='Today History';
    }else{
      this.currentTab='Real Time Chart';
    }
  }
  getWebsiteDayWiseDownTimeHistory(){
    this.downtimeInfoService.getWebsiteDayWiseDownTimeHistory(this.currentWebsite.webId).subscribe(data=>{
      this.downtimeHistory= data.body as DownTimeSummary[];
      this.createHistoryBarChart();
      this.createHistoryPiChart();
    },error => {

    });

  }
 //endregion

}
