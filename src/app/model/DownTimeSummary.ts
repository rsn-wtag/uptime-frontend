import {Timestamp} from "rxjs";

export class DownTimeSummary{
     date:Timestamp<any>;
     webId: number;
     totalDownTime:number;
     uptimePercentage:number;
     totalUpTime: number;
}
