import * as Stomp from 'stompjs';
import * as SockJs from 'sockjs-client';
import {DashboardComponent} from "../dashboard/dashboard.component";
import {properties} from "../properties";
import {WebsiteDetails} from "../model/WebsiteDetails";
import {UptimeStatus} from "../model/UptimeStatus";

export class WebSocketConfig{
    webSocketEndPoint: string= properties.websocketUrl;
    topic: string="/dashboard/data/";
    stompClient: any;
    dashboardComponent: DashboardComponent;
    constructor(dashboardComponent: DashboardComponent ) {
      this.dashboardComponent= dashboardComponent;
    }
    _connect(websiteList: WebsiteDetails[]){
      console.log("Initializing websocket");
      let ws= new SockJs(this.webSocketEndPoint);
      this.stompClient = Stomp.over(ws);
      console.log("websocket connect success")
      const _this = this;
      this.stompClient.heartbeat.incoming = 1000;
      _this.stompClient.connect({}, function (frame) {
        console.log("connected successfully");
        for(const website of websiteList){
          _this.stompClient.subscribe(_this.topic+website.webId, function (sdkEvent) {
            _this.onMessageReceived(sdkEvent);
          });
        }


        _this.stompClient.reconnect_delay = 2000;
      },(error)=> this.errorCallBack(error, () => this._connect(websiteList)));
    };
  _disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error, reconnect: () => void) {
    console.log("errorCallBack -> " + error);
    setTimeout(() => {
      reconnect();
    }, 10000);
  }
  /*_send() {
    console.log("calling logout api via web socket");
    this.stompClient.send("/app/getData", {}, JSON.stringify("message"));
  }*/

  onMessageReceived(message) {
   // console.log("Message Recieved from Server :: " + message);

    this.dashboardComponent.handleMessage(JSON.stringify(message.body));

  }
}
