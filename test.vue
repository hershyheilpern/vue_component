<script defer>
    // import test from '../components/test.vue'

    export default {
        el: '#app',
        data: {
            member_uuid: "",
            comps: comps,
            appReady: false,
            logedin: false,
            showBUSelector: false,
            askBu: false,
            BUSelectorCall: null,
            lists: {},
            calls: [],
           notification_token:null,
            // opencalls: [

            // ],
            // activeCalls: [

            // ],
            // recentCalls: [

            // ],
            covirCall: {
                show: false,
                showThanks: false,
                call: {},


            },
            time: {
                now: new Date(),
                lastUpdate: new Date(),
                updateStatus: "ready"
            },
            intervals: {
                int1: null,
                int2: null,
            },
            styles: {
                scroolDiv: {
                    // position
                }
            }

        },
        created() {
            // this.loadlists()
            // this.updateCalls()
            // this.updates()
            this.getMemberUuid()
        },
        methods: {
            myFunction() {
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
},
            getMemberUuid() {

                $.ajax({
                    url: "/members/member_uuid",
                    success: function (result) {

                        app.member_uuid = result
                    },
                    error: function (a, b, c) {

                    }
                });
            },

            reload() {
                window.location.reload()
            },
            openUrl(url, newTab) {
                if (newTab) {
                    window.open(url, '_blank')
                } else {
                    window.open(url)
                }
            },
            getArea(area) {
                if (this.lists.areas && area) {
                    return this.lists.areas.find(v => v.id == area)
                } else {
                    return ""
                }

            },
            checkParent(parent,child){
                if (this.lists.issues){
                    return this.lists.issues.find(v => v.id == child && v.parent_cat_uuid == parent)
                }else{
                    return false
                }
            },
            
            getIssue(issue) {
                if (this.lists.issues) {
                    return this.lists.issues.find(v => v.id == issue).issue
                } else {
                    return ""
                }

            },
            getMake(make) {
                if (this.lists.car_make && make) {
                    return this.lists.car_make.find(v => v.id == make).make
                } else {
                    return ""
                }

            },
            getModel(model) {
                if (this.lists.car_model && model) {
                    return this.lists.car_model.find(v => v.id == model).model
                } else {
                    return ""
                }

            }, getColor(color) {
                if (this.lists.colors && color) {
                    return this.lists.colors.find(v => v.id == color).color
                } else {
                    return ""
                }

            },
            getResponder(call) {
                if (this.lists.responders) {
                    return this.lists.responders.filter(v => v.call_uuid == call)

                } else {
                    return ""
                }

            },
            getResponderName(responder) {
                if (this.lists.members) {
                    let unit = this.lists.members.find(v => v.id == responder)
                    return this.lists.areas.find(v => v.id == unit.unit_location).area_id + unit.unit_number
                } else {
                    return ""
                }

            },
            getResponderPhone(responder) {

                if (this.lists.members && responder && this.lists.phone) {
                    let unit = this.lists.members.find(v => v.id == responder)

                    let typeMobile = "9eeafabf-3a19-464a-8068-41853370efb9"
                    let phones = this.lists.phone.filter(v => (v.member_uuid == unit.id))
                    if (phones.find(v => v.primary == true)) {
                        return phones.find(v => v.primary == true).number
                    } else if (phones.find(v => v.type == typeMobile)) {
                        return phones.find(v => v.type == typeMobile).number
                    } else {
                        return phones[0]
                    }

                } else {
                    return "#"
                }

            },
            getDispatcherPhone(dispatcher) {
                if (this.lists.dispatcher) {
                    return this.lists.colors.find(v => v.id == color).color
                } else {
                    return ""
                }

            },
            loadlists() {
                if (localStorage.getItem("lists")) {
                    this.lists = JSON.parse(localStorage.getItem("lists"))
                } else {
                    $.ajax({
                        url: `/members/lists`,
                        success: (res) => {
                            localStorage.setItem("lists", res)
                            this.lists = JSON.parse(res)
                        },
                        error: (err) => {
                            console.error(err)
                        },
                    })
                }
            },
            // addressSplit(address){
            //         let    splitted= address.split(",")
            //         return splitted[0] + splitted[1]
            // },
            primaryMember(call) {
                if (this.lists.responders && call) {
                    return this.lists.responders.find(v => { return (v.call_uuid == call && v.responder == this.member_uuid && v.coverage_type == "ada594f2-d52f-44ac-bf61-fadbe25587cd") })
                } else {
                    return ""
                }

            },
            isLogedIn: function () {
                $.ajax({
                    url: "/members/islogedin", success: function (result) {
                        app.logedin = (result >= 3)
                    }
                });
            },
            coverCallDialog: function (call) {
                if (document.getElementById('popup')) {
        var ignoreClickOnMeElement = document.getElementById('popup');
        var isClickInsideElement = ignoreClickOnMeElement.contains(event.target);
        if (!isClickInsideElement) {
            this.covirCall.call = call;
                this.covirCall.show = true
        }
      }
      else{
        this.covirCall.call = call;
                this.covirCall.show = true
      }
               
            },
            coverCallConferm: function () {
                this.coverCall()
                this.covirCall.showThanks = true;
            },
            coverCallThanks: function () {
                this.covirCall.show = false;
                this.covirCall.showThanks = false;
                this.covirCall.call = {};
            },
            coverCallCancel: function () {
                this.covirCall.show = false;
                this.covirCall.showThanks = false;
                this.covirCall.call = {};
            },
            coverCall: function () {

                //send data to server
                $.ajax({
                    url: `/members/cover_call/${this.covirCall.call.id}`,

                    success: function (result) {
                        cl(result)

                        // app.updateCalls()
                    },
                    error: function (a, b, c) {
                        cl(a, b, c)
                    }
                });

            },
            openBU(i) {
                this.showBUSelector = true
                this.BUSelectorCall = i
            },
            openAskBU(i) {
                this.askBu = true
                this.BUSelectorCall = i
            },
            updateCalls: function () {
                let self = this
                // cl(this.time.updateStatus)
                if (this.time.updateStatus == "ready") {
                    this.time.updateStatus = "update"
                    $.ajax({
                        url: "/members/allcalls",
                        success: function (result) {
                            self.calls = JSON.parse(result).sort((a, b) => a.call_number - b.call_number)
                            app.time.lastUpdate = new Date()
                            document.title = `(${app.opencalls.length}) Chaveirim`
                            app.time.updateStatus = "ready"

                        },
                        error: function (xhr, exception) {
                            app.isLogedIn()
                            app.time.updateStatus = "ready"
                        }

                    });
                }
            },
            updates: function () {
                // cl(this.time.updateStatus)
                if (this.time.updateStatus == "ready") {
                    this.time.updateStatus = "update"
                    $.ajax({
                        url: "/updates",
                        success: function (result) {
                            let updates = JSON.parse(result)
                            app.lists.updates = updates
                            app.time.updateStatus = "ready"

                        },
                        error: function (xhr, exception) {
                            app.isLogedIn()
                            app.time.updateStatus = "ready"
                        }

                    });
                }
            },

            updateTime: function () {
                this.time.now = new Date()
            },
            niceDate: function (date) {
                return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.toLocaleTimeString()
            },
            niceDateF: function (date) {
                let callDate = new Date(date)
                let cddays = Math.floor((callDate.getTime() - (1000 * 60 * 60 * 5)) / (1000 * 60 * 60 * 24))
               
                if (this.time.now.getTime() < callDate.getTime() + 60000) {
                    return "Less then a minute ago"
                    //less then 1 hour    
                } else {//if{ (this.time.now.getTime() < callDate.getTime() + 3600000) {
                    return ((this.time.now.getTime() - callDate.getTime()) / 60000).toFixed(0) + " Minutes ago"
                }
                // }else if(ndays == cddays) {
                //     return "Today"+ " " + callDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                //     //yesterday
                // } 

            },
            allInterval: function () {
                if (this.logedin == true) {
                    // console.log("setting intrvils")
                    // this.intervals.int1 = setInterval(app.updateCalls, 5000)
                    this.intervals.int2 = setInterval(app.updateTime, 1000)
                } else {
                    // clearInterval(this.intervals.int1)
                    clearInterval(this.intervals.int2)
                }
            }
        },
        computed: {
            openUrgent() {
                return this.opencalls.find(v => v.urgent == true)
            },
            opencalls() {

                let openCalluuid = ["2b4ed1c6-0fae-45a5-9399-64bdd2b5fc62", "f7d8125e-68eb-4499-9768-5099e2cc32d8"]
                return this.calls.filter(call => openCalluuid.includes(call.call_state)).sort((a, b) => new Date(b.status_update) - new Date(a.status_update))
            },
            activeCalls() {
                let activeCalluuid = ["ce993702-0032-4885-bd7f-1b70d8e125fc"]
                return this.calls.filter(call => activeCalluuid.includes(call.call_state)).sort((a, b) => new Date(b.status_update) - new Date(a.status_update))
            },
            recentCalls() {
                let recentCalluuid = ["05a809fb-3651-47af-9187-36963cbf486a"]
                return this.calls.filter(call => recentCalluuid.includes(call.call_state)).sort((a, b) => new Date(b.status_update) - new Date(a.status_update))
            },


        },
        watch: {
            logedin: function () {
                this.allInterval()
            },
            calls: () => {
             
                app.time.lastUpdate = new Date()
                document.title = `(${app.opencalls.length}) Chaveirim`
            }
        },
        components: {
        }
    }
</script>
<style>
    #app{
      background-image: url("../images/logo3.jpg");
    background-size:contain;
      background-repeat: no-repeat;  background-position: center ; 
  }
    .hide {
        opacity: 0
}

#myDIV:hover + .hide {
    opacity: 1;
    background-color:rgb(199, 199, 233);
    border: solid 1px;
    
  
}
#myDIV:hover {
    opacity: 0
  
}
    body {
        overflow: hidden;
    }

    .fade-enter-active {
        transition: opacity 500ms
    }

    .fade-leave-active {
        transition: opacity 500ms
    }

    .fade-enter,
    .fade-leave-to
    /* .fade-leave-active in <2.1.8 */

        {
        opacity: 0
    }

    #confermCoverbackground {
        background-color: gray;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 80%;

    }
  
    #confermCoverDialog {
        /* width: 50px; */
        height: 200px;

        position: absolute;
        top: 150px;
        left: 20px;
        right: 20px;
        opacity: 100%;

    }

    tr.opencall:nth-child(even) {
        background: #99ffff
    }

    tr.opencall:nth-child(odd) {
        background: #ADD8E6
    }

    tr.activeCalls:nth-child(even) {
        background: #99ffff
    }

    tr.activeCalls:nth-child(odd) {
        background: #ADD8E6
    }

    tr.recentCalls:nth-child(even) {
        background: #99ffff
    }

    tr.recentCalls:nth-child(odd) {
        background: #ADD8E6
    }

    .urgentRed {
        background-color: red;
    }

    .memberWaitingYellow {
        background-color: yellow;
    }

    .scroolDiv {
        position: absolute;
        top: 45px;
        bottom: 0;
        left: 0;
        right: 0;
        overflow-y: auto;
    }
    .cover{
        font-size: small;
    }
   
    .min{
    min-width: 600px;
}
.multiselect__tags {
        border-radius: 0;
          min-height: 0px;
          padding-top: 4px;
    padding-right: 40px;
    padding-bottom: 0px;
    padding-left: 4px;

      }
       
      .multiselect__single {
  
  margin-bottom: 4px;
}
.multiselect__option {
    min-height: 0px;
    padding: 4px;
}
.multiselect__select {
    min-height: 0px;
    padding-bottom: 12px;
}
.multiselect{
  min-height: 0px;
}
@media screen and (max-width: 500px) {
   

.min{
    min-width: 210px;
}
}

.popup {
  position: relative;
  display: inline-block;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* The actual popup */
.popup .popuptext {
  visibility: hidden;
  width:fit-content;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 8px ;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -80px;
}

/* Popup arrow */
.popup .popuptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

/* Toggle this class - hide and show the popup */
.popup .show {
  visibility: visible;
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
}

/* Add animation (fade in the popup) */
@-webkit-keyframes fadeIn {
  from {opacity: 0;} 
  to {opacity: 1;}
}

@keyframes fadeIn {
  from {opacity: 0;}
  to {opacity:1 ;}
}



</style>

<template>
      <div id="app">
        <!-- <div v-if="notification_token">{{notification_token}}</div> -->
        <meta v-if="openUrgent" name="theme-color" content="red">
        <!-- <div v-if="appReady"> -->
        <div v-if="!Object.keys(comps).length">
            <login v-if="!logedin"></login>
        </div>

        <div v-if="logedin">
            <!-- <table id="openCalls" WIDTH="95%" ALIGN="center" BORDER="1">
                <tr>
                    <td style="text-align: center"> -->
                        <div style=" background: linear-gradient(rgba(255, 255, 255, 0.93), rgba(255, 255, 255, 0.93));  text-align: center; width:100%; height: 100%;" >
                            <!-- <center><img alt="logo" :src="logo"></center> -->
                            <center align="center"style="width: 95%;"
                            :style="[time.now.getTime() < time.lastUpdate.getTime()+20000 ? {'background-color':'green'}:{'background-color':'orange'}]">
                            <b> Now is: </b> &nbsp{{niceDate(time.now)}} <i
                                v-if="time.now.getTime() > time.lastUpdate.getTime()+20000" class="material-icons"
                                style="cursor: pointer;  vertical-align: middle;" @click="reload()">&#xe5d5;</i>
                            <updates :show="true" type="server" :cats="[1,2]" style="position: fixed;top: 0;right: 0;"></updates>
                           
                        </center>
                        <!-- </td>
                            </tr>
                            <tr>
                                <td style="text-align: center">
                                    <b> Calls last Updated: </b> &nbsp{{time.lastUpdate}}
                                </td>
            
                            </tr>
                        </table> -->
                       
                        <div class="scroolDiv" >
                         <HR style="width: 95%;">
                            <table id="openCalls" WIDTH="95%" ALIGN="center" BORDER="1">
                                <tr>
                                    <th>
                                        OPEN CALLS
                                    </th>
                                </tr>
                                <tr>
                                    <td style="text-align: center">
                                        To cover a call, Select the call
                                    </td>
            
                                </tr>
                               
                                <tr v-if="opencalls.length > 0" v-for="call in opencalls" :key="call.message" class="opencall"
                                    v-on:click="coverCallDialog(call)">
                                  
                                   
                                     <td align="center" style="cursor: pointer;"
                                        :class="{'urgentRed':call.urgent,'memberWaitingYellow':call.staying}">
                                        
                                        <span class="callTest">{{call.call_number}} [{{call.reqnum}}]
                                            <span style="font-size: 10px;"> {{niceDateF(call.status_update)}}</span>
                                            {{getArea(call.area).area_id}}<template v-if="getArea(call.area).show_sub">:
                                                {{call.area_sub}} &nbsp;</template>
                                            <span v-if="call.staying"> <b>Member Waiting</b> </span>
                                            <span v-if="call.call_state == 'f7d8125e-68eb-4499-9768-5099e2cc32d8'"> <b>B/U
                                                    Requested</b> </span>
                                            <span v-if="call.bu_with"> <b>With: {{call.bu_with}}</b> </span>
                                            <template v-for="(issue,i) in call.issue2"><template v-if="i !== 0">& </template>
                                                {{getIssue(issue)}}
                                                <template v-if="checkParent(issue,issue3)" v-for="issue3 in call.issue3">-&nbsp;{{getIssue(issue3)}}&nbsp;</template>
                                            </template>
                                          {{call.issue_other}}
                                            {{call.issue_info}}
                                        </span>&nbsp;
                                        <span style="text-decoration: underline;"
                                            @click.stop="openUrl(call.address_obj.url,true)">@{{call.address}}</span> &nbsp;
                                            <span v-if="call.apt">
                                                #{{call.apt}}
                                            </span>
                                            &nbsp;
                                            <span v-if="call.bet1">
                                                [{{call.bet1}}/{{call.bet2}}]
                                            </span>
                                           
                                        &nbsp;
                                        <span v-if='call.issue1=="8b2cea7b-7ea9-4636-8531-85f47d9f604b"'> {{getColor(call.color)}}
                                            {{getMake(call.make)}} - {{getModel(call.model)}} &nbsp;</span>
                                            <template v-if="call.car_other">{{call.car_other}}</template>
                                        
                                        <a v-for="i in getResponder(call.id)" :href="'tel:'+getResponderPhone(i.responder)">
                                            ({{getResponderName(i.responder)}})</a>
                                            <div  v-if="call.note_member" id="popup" class="popup" @click="myFunction()">
                                                <i   class="material-icons" >&#xe873;  </i>
                                                <span class="popuptext" id="myPopup">{{call.note_member}}</span>
                                              </div>
                                     </td>
                                
                                </tr>
                                <tr v-if="opencalls.length == 0">
                                    <td align="center">No calls at this Time {{niceDate(time.now)}}</td>
                                </tr>
                            </table>
                            <BR>
                            <HR style="width: 95%;">
                            <BR>
                            <table id="activeCalls" WIDTH="95%" ALIGN="center" BORDER="1" CELLSPACING="0" CELLPADDING="1">
                                <tr>
                                    <th>
                                        ACTIVE CALLS
                                    </th>
                                <tr v-if="activeCalls.length > 0" v-for="(call,i) in activeCalls" :key="call.message"
                                    class="activeCalls">
                                    <td align="center" style="cursor: pointer;" :class="{'urgentRed':call.urgent}">
                                        <span class="callTest">{{call.call_number}}&nbsp;[{{call.reqnum}}]
                                            <span style="font-size: 10px;"> {{niceDateF(call.status_update)}}</span>
                                            {{getArea(call.area).area_id}}
                                            <template v-if="getArea(call.area).show_sub">:{{call.area_sub}} &nbsp;
                                            </template>
                                            <template v-for="(issue,i) in call.issue2"><template v-if="i !== 0">& </template>
                                                {{getIssue(issue)}}
                                                <template v-if="checkParent(issue,issue3)" v-for="issue3 in call.issue3">-&nbsp;{{getIssue(issue3)}}&nbsp;</template>
                                            </template>
                                            </template>
                                            
                                            {{call.issue_other}}
                                            {{call.issue_info}}
                                        </span>&nbsp;
                                        <a target="_blank" v-bind:href="call.address_obj.url">@{{call.address}}</a>
                                        <span v-if="call.apt">
                                            #{{call.apt}}
                                        </span>
                                        &nbsp;
                                        <span v-if="call.bet1">
                                            [{{call.bet1}}/{{call.bet2}}]
                                        </span>
                                       
                                    &nbsp;
                                        <span v-if='call.issue1=="8b2cea7b-7ea9-4636-8531-85f47d9f604b"'> {{getColor(call.color)}}
                                            {{getMake(call.make)}} - {{getModel(call.model)}}&nbsp; </span>
                                            <template v-if="call.car_other">{{call.car_other}}</template>
                                        <a v-if="primaryMember(call.id)" :href="'tel:'+call.phone"> {{call.phone}}</a>
            
                                        <a v-for="v in getResponder(call.id)" :href="'tel:'+getResponderPhone(v.responder)">
                                            ({{getResponderName(v.responder)}})</a>
                                        <div style="display: inline-block;float: right;"><span v-if="primaryMember(call.id)"
                                                style=""> <button v-on:click="openAskBU(i)"
                                                    style="width: 100px; height: 20px;  margin: auto; margin-left: 5px;">Req
                                                    B/U</button></span>
                                            <span v-if="primaryMember(call.id)" style=""> <button v-on:click="openBU(i)"
                                                    style="width: 100px; height: 20px;   margin: auto;">B/U &
                                                    CLOSE</button></span>
                                        </div>
                                </tr>
                                <tr v-if="activeCalls.length == 0">
                                    <td align="center">No calls at this Time {{niceDate(time.now)}}</td>
                                </tr>
                            </table>
                            <BR>
            
                            <BR>
                            <!--table id="recentCalls" WIDTH="95%" ALIGN="center" BORDER="1" CELLSPACING="0" CELLPADDING="1">
                                <tr>
                                    <th>
                                        RECENT CALLS (last 15 minutes)
                                    </th>
                                </tr>
                                <tr v-if="recentCalls.length > 0" v-for="call in recentCalls" :key="call.message" class="opencall">
                                    <td align="center" style="cursor: pointer;" :class="{'urgentRed':call.urgent}">
                                        <span class="callTest">{{call.call_number}}&nbsp; [{{call.reqnum}}]
                                            {{getArea(call.area).area_id}}:&nbsp;
                                            <template v-if="getArea(call.area).show_sub">{{call.area_sub}}</template> &nbsp;
                                            <template v-for="(issue,i) in call.issue2"><template v-if="i !== 0">& </template>
                                                {{getIssue(issue)}}
                                                <template v-if="checkParent(issue,issue3)" v-for="issue3 in call.issue3">-&nbsp;{{getIssue(issue3)}}&nbsp;</template>
                                            </template>
                                            </template>
                                          
                                            {{call.issue_other}}
                                            {{call.issue_info}}
                                        </span>&nbsp;
                                        <a target="_blank" v-bind:href="call.address_obj.url">@{{call.address}}</a>
                                        &nbsp;
                                        <span> {{getColor(call.color)}}
                                            {{getMake(call.make)}} - {{getModel(call.model)}} </span>
                                            <template v-if="call.car_other">{{call.car_other}}</template>
                                        <a :href="'tel:'+call.phone"> {{call.phone}}</a>
            
                                        <a v-for="i in getResponder(call.id)" :href="'tel:'+getResponderPhone(i.responder)">
                                            ({{getResponderName(i.responder)}})</a>
                                    </td>
                                </tr>
                                <tr v-if="recentCalls.length == 0">
                                    <td align="center">No calls at this Time {{niceDate(time.now)}}</td>
                                </tr>
                            </table-->
                        </div>
                        <transition name="fade">
                            <div id="confermCover" v-show="covirCall.show">
                                <div id="confermCoverbackground">
            
                                </div>
                                <div id="confermCoverDialog">
                                    <table
                                        style="color:white; background:linear-gradient(rgba(48, 17, 88, 0.92), rgb(48, 17, 88 , 82%), rgb(48, 17, 88 ,94%), rgb(49, 18, 88)); width: 100%; height: 200px;">
                                        <tr>
                                            <td style="text-align: center; font-size: 25px; font-family: Helvetica, sans-serif"
                                                colspan="2" v-show="!covirCall.showThanks">
                                                Cover Call:
                                                <template>#{{covirCall.call.call_number}}&nbsp;-</template>&nbsp;
                                                <template v-for="i in covirCall.call.issue2" ><span class="cover" style="white-space: nowrap">{{getIssue(i)}}</span>&nbsp;</template>
                                                <template v-for="i in covirCall.call.issue3" ><span class="cover" style="white-space: nowrap">{{getIssue(i)}}</span>&nbsp;</template>
                                               <span class="cover">{{covirCall.call.issue_other}}</span>
                                                <br> <span @click="openUrl(covirCall.call.address_obj.url,true)" class="cover">
                                                    AT:&nbsp;{{covirCall.call.address}}</span>
                                                   <span  v-if="covirCall.call.call_dispatcher" class="cover">
                                                    <br > 
                                                        Please Call Dispatcher</span>
                                            </td>
                                            <td style="text-align: center; font-size: 25px;font-family: Helvetica, sans-serif"
                                                v-show="covirCall.showThanks">
                                                Thanks for covering call:
                                                <br>
                                                <template class="cover">#{{covirCall.call.call_number}}&nbsp;-</template>&nbsp;
                                                <template v-for="i in covirCall.call.issue2" ><span class="cover" style="white-space: nowrap">{{getIssue(i)}}&nbsp;</template>
                                                <template v-for="i in covirCall.call.issue3"><span class="cover" style="white-space: nowrap">{{getIssue(i)}}&nbsp;</template>
                                               <span class="cover">{{covirCall.call.issue_other}}</span> 
                                                <br>
                                                <span @click="openUrl(covirCall.call.address_obj.url,true)" class="cover">
                                                    AT:&nbsp;{{covirCall.call.address}}</span>
                                            </td>
                                        </tr>
                                        <tr v-show="!covirCall.showThanks">
                                            <td><button v-on:click="coverCallCancel()"
                                                    style="width: 100px; height: 30px; display: block;  margin: auto;">Cancel</button>
                                            </td>
                                            <td v-if="!covirCall.call.call_dispatcher"><button v-on:click="coverCallConferm()"
                                                    style="width: 100px; height: 30px; display: block;  margin: auto;">Confirm</button>
                                            </td>
                                            <td v-else>
                                                <button style="width: 150px; height: 30px; display: block;  margin: auto;"> <a
                                                        :href="'tel:'+7184318181">Call Dispatcher</a></button>
                                            </td>
                                        </tr>
                        </transition>
                        <transition name="fade">
                            <tr v-show="covirCall.showThanks">
                                <td><button v-on:click="coverCallThanks()"
                                        style="width: 100px; height: 30px; display: block;  margin: auto;">Close</button>
                                </td>
                            </tr>
                            </table>
                    </div>
                </div>
            
                </div>
                     <transition name="fade">
                    <div id="BUSelector" v-if="showBUSelector">
                        <div id="confermCoverbackground"></div>
                        <select-coverage :call="activeCalls[BUSelectorCall]" :lists="lists" v-model="showBUSelector">
                        </select-coverage>
                    </div>
                    <div id="BUSelector" v-if="askBu">
                        <div id="confermCoverbackground"></div>
                        <req-bu :call="activeCalls[BUSelectorCall]" :lists="lists" v-model="askBu"> </req-bu>
                    </div>
                    </div>
                    <!-- </div> -->
                    </div>
                        </div>
                    </div>

</template>
