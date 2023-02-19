//視窗顯示畫面
const modalDisplay = {
    data(){
		return {
            shareState:store.state,
			title : '',
			disabled:false,
			inputList:{
				timestrip:undefined,
				dateInput:new Date((+new Date + 8*3600*1000)).toISOString().substring(0, 10),
				moneyTypeInput:1,
				incomeType:'',
				exesType:'',
				amount:undefined,
				flag:0
			},
		}
	},
    template:
    `
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" >{{title}}</h5>
            </div>
            <form @submit.prevent="submitForm()">
                <div class="modal-body">
                    <div class="input-group mb-3 row">
                        <label class="input-group-text col-6" for="dateInput">日期:</label>
                        <input type="date" class="form-control col-6" id="dateInput" required v-model="inputList.dateInput" :disabled="disabled">
                    </div>
                    <div class="input-group mb-3 row">
                        <label class="input-group-text col-2" for="options-outlined">種類:</label>
                        <input type="radio" class="btn-check" name="options-outlined" id="success-outlined" value = 0 required @click="inputList.exesType = ''" v-model="inputList.moneyTypeInput" autocomplete="off" :disabled="disabled">
                        <label class="btn btn-outline-success col-5" for="success-outlined">收入</label>
                        <input type="radio" class="btn-check" name="options-outlined" id="danger-outlined" value = 1 @click="inputList.incomeType = ''" v-model="inputList.moneyTypeInput" autocomplete="off" :disabled="disabled">
                        <label class="btn btn-outline-danger col-5" for="danger-outlined">支出</label>
                    </div>
                    <template v-if = 'inputList.moneyTypeInput == 0'>
                        <div class="input-group mb-3 row ">
                            <label class="input-group-text col-6" for="incomeType">收入類型:</label>
                            <select class="form-select col-6" aria-label="incomeType" required v-model="inputList.incomeType" :disabled="disabled">
                                <option selected value='' disabled>請選擇</option>
                                <option value="0">薪水</option>
                                <option value="1">投資</option>
                                <option value="2">其他</option>
                            </select>
                        </div>
                    </template>
                    <template v-else>
                        <div class="input-group mb-3 row ">
                            <label class="input-group-text col-6" for="exesType">支出類型:</label>
                            <select class="form-select col-6" aria-label="exesType" required v-model="inputList.exesType" :disabled="disabled">
                                <option selected value='' disabled>請選擇</option>
                                <option value="0">伙食費</option>
                                <option value="1">交通費</option>
                                <option value="2">治裝費</option>
                                <option value="3">貸款</option>
                                <option value="4">電話費</option>
                                <option value="5">其他</option>
                            </select>
                        </div>
                    </template>
                    <div class="input-group mb-3 row">
                        <label class="input-group-text col-6" for="amount">費用:</label>
                        <input type="number" class="form-control col-6" id="amount" min = '1' required v-model="inputList.amount" :disabled="disabled">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" id='close' class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    <button type="submit" class="btn btn-primary" >確定</button>
                </div>
            </form>
        </div>
    </div>
    `,
    methods:{
        closeModal(){
            const modalDom = document.getElementById('close')
            modalDom.click()
            
        },
        clear(){
            this.inputList.timestrip = undefined
			this.inputList.moneyTypeInput = 1
			this.inputList.dateInput = new Date((+new Date + 8*3600*1000)).toISOString().substring(0, 10)
			this.inputList.incomeType = ''
			this.inputList.exesType = ''
			this.inputList.amount = undefined
			this.inputList.flag = 0
            console.log("清空")
        },
        submitForm(){
            switch (this.shareState.actionType) {
                case 1 :
                    this.$store.dispatch('ADD', this.inputList);
                    break;
                case 2 :
                    this.$store.dispatch('UPDATE', this.inputList);
                    break;
                case 3 :
                    this.$store.dispatch('DELETE', this.inputList);
                    break;
            }
            
            this.clear()
            this.closeModal()
            this.saveState()
        },
        saveState() {
            localStorage.setItem('lists', this.$store.getters.toJSON); 
        },
    },
    watch:{
        'shareState.actionType':function(){
            let actionType = this.shareState.actionType
            actionType === 1 ? this.title = '新增紀錄' : actionType === 2 ? this.title = '編輯紀錄' : this.title = '刪除紀錄'
            actionType === 1 || actionType === 2 ? this.disabled = false : this.disabled = true
        },
        'shareState.originalArray.timestrip':function(){
            let actionType = this.shareState.actionType
            actionType === 1 || actionType === 2 ? this.disabled = false : this.disabled = true
            let originalArray = this.shareState.originalArray
            this.inputList.amount = originalArray.amount
            this.inputList.timestrip = originalArray.timestrip
			this.inputList.moneyTypeInput = originalArray.moneyTypeInput
			this.inputList.dateInput = originalArray.dateInput
			this.inputList.incomeType = originalArray.incomeType
			this.inputList.exesType = originalArray.exesType
			this.inputList.flag = originalArray.flag
        }
    }
}
Vue.component('modal-display',modalDisplay)
//視窗元件
let modalElement = {
    template: 
    `
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <modal-display></modal-display>
    </div>
    `
}
Vue.component('modal-element',modalElement)

//NavBar
const Nav ={
	template:`
	<div class="mb-5">
		<nav class="pe-3 navbar fixed-top navbar-expand-lg navbar-light bg-light">
			<div class="container-fluid">
				<i class="bi bi-star-fill"></i>
				<span class="navbar-brand">記帳本</span>
				<button id = "navbar" class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" @click = "clickHandler()">
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse" id="navbarSupportedContent">
					<ul class="navbar-nav me-auto mb-2 my-2 mb-lg-0">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/">記帳</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/chart">圖表</router-link>
                        </li>
					</ul>
					
				</div>
			</div>
		</nav>
	</div>`,
	methods:{
        clickHandler(){
			const navLinks = document.querySelectorAll('.nav-item')
			const menuToggle = document.getElementById('navbar')
			/* const bsCollapse = new bootstrap.Collapse(menuToggle) */
			navLinks.forEach((event) => {
				event.addEventListener('click', () => { menuToggle.click() })
			})
            
        }
    }

}

//列表顯示
let listDisplay = {
    name:'listDisplay',
    template:
    `
    <div class="col-sm-12 pt-3">
        <modal-element></modal-element>
        <button id = 'addbutton' type="button" class="btn btn-primary" @click="modalTypeHandler(1)" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
            <i class="bi bi-pencil"></i>
        </button>
        <div class="card main-card">
            <ul class="list-group">
                <li v-for="event in getData" :key="event.timestrip" class="lists-group-item flex-container py-1 pe-1">
                    <h3 class="lists-group-item-heading px-1" :style = "{'color': event.exesType !== '' ? '#C0392B': '#145A32'}">
                        <i class="bi bi-currency-dollar"></i> 
                        {{ event.amount }}
                    </h3>
                    <h5 class = 'px-2'>
                        <i class="bi bi-calendar-heart"></i> 
                        {{ event.dateInput }}
                    </h5>
                    <h5 class = 'px-2' v-show = "event.moneyTypeInput == '0'">
                        <i class="bi bi-card-text"></i>
                        <span v-show = "event.incomeType == '0'">薪水</span>
                        <span v-show = "event.incomeType == '1'">投資</span>
                        <span v-show = "event.incomeType == '2'">其他</span>
                    </h5>
                    <h5 class = 'px-2' v-show = "event.moneyTypeInput == '1'">
                        <i class="bi bi-card-text"></i>
                        <span v-show = "event.exesType == '0'">伙食費</span>
                        <span v-show = "event.exesType == '1'">交通費</span>
                        <span v-show = "event.exesType == '2'">治裝費</span>
                        <span v-show = "event.exesType == '3'">貸款</span>
                        <span v-show = "event.exesType == '4'">電話費</span>
                        <span v-show = "event.exesType == '5'">其他</span>
                    </h5>
                    <button class="btn btn-xs btn-warning mx-2" @click="modalTypeHandler(2,event)"  data-bs-toggle="modal" data-bs-target="#staticBackdrop" >修改</button>
                    <button class="btn btn-xs btn-danger mx-2" @click="modalTypeHandler(3,event)"  data-bs-toggle="modal" data-bs-target="#staticBackdrop">刪除</button>
                </li>
            </ul>
        </div>
    </div>
    `,
    methods:{
        modalTypeHandler(type,thisArray){
            if(thisArray === undefined){
                //新增塞預設陣列給actions
                thisArray = {
                    timestrip:undefined,
                    dateInput:new Date((+new Date + 8*3600*1000)).toISOString().substring(0, 10),
                    moneyTypeInput:1,
                    incomeType:'',
                    exesType:'',
                    amount:undefined,
                    flag:0
                }
            } 
            actionObject = {
                'type':type,
                'originalArray':thisArray
            }
            this.$store.dispatch('SETACTIONS', actionObject);
        },
    },
    computed:{
        getData(){
            return this.$store.getters.filterList
        }
    }
}
//圖表元件
const Chart = {
    data(){
        return {
            shareState : store.state,
            noData:false,
            //報表種類 0 1:總計 2:收入分類加總 3:支出分類加總
            chartType : 1,
            labelList : [],
            setData:[],
        }
    },
    template : `
	<div class="col-sm-12 pt-3">
        <div class="btn-toolbar justify-content-center" role="toolbar" aria-label="Toolbar with button groups">
            <div class="btn-group pe-1 " role="group" aria-label="First group">
                <button type="button" class="btn btn-outline-secondary" @click="chartType = 1">收支總表</button>
            </div>
            <div class="btn-group pe-1">
                <button type="button" class="btn btn-outline-secondary" @click="chartType = 2">收入分類總表</button>
            </div>
            <div class="btn-group pe-1">
                <button type="button" class="btn btn-outline-secondary" @click="chartType = 3">支出分類總表</button>
            </div>
        </div>
		<pie-chart  v-show = "!noData && chartType != 0" :chartData = "{'labelList':labelList,'setData':setData}"  :options="{responsive: true, maintainAspectRatio: false}" ></pie-chart>
		<div v-show = "noData" class="text-center pt-2">沒有資料</div>
	</div>`,
    mounted(){
        const result = this.shareState.lists.filter(value => value.flag === 0)
        console.log(result)
        result.length === 0 ? this.noData = true : this.noData = false
        this.changeData()
        
    },
    methods:{
        changeData(){
             //重置
            this.labelList = []
            this.setData = []
            switch (this.chartType) {
                case 0:
                    this.noData = true
                    //this._chart.destroy();
                    break;
                case 1:
                    //標籤名稱
                    this.labelList = ["收入","支出"]
                    let income = 0
                    let expenditure = 0
                    this.shareState.lists.filter((value)=>{
                        if(value.flag == 0 && value.moneyTypeInput == 0){
                            income += parseInt(value.amount)
                        }else if(value.flag == 0 && value.moneyTypeInput == 1){
                            expenditure += parseInt(value.amount)
                        }
                    })
                    income === 0 && expenditure === 0 ? this.noData = true  : this.noData = false
                    this.setData = [{
                        //顏色
                        backgroundColor:[
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)',
                        ],
                        data:[income,expenditure]
                    }]
                    
                    break;
                case 2:
                    //過濾收入
                    const incomeArray = this.shareState.lists.filter((element)=>{
                        return element.flag === 0 && element.moneyTypeInput == 0
                    })
                    
                    incomeArray.length === 0 ? this.noData = true : this.noData = false
                    const incomeSortArray = incomeArray.reduce((acc, cur, i) => {
                        const item = i > 0 && acc.find(element => element.type == cur.incomeType)
                        if(item){
                            item.value += parseInt(cur.amount);
                        }else{
                            acc.push(
                                {
                                    type:cur.incomeType, 
                                    value:parseInt(cur.amount)
                                }
                            );
                        }
                        return acc;
                    }, [])
                    this.setData = [{backgroundColor:[],data:[]}]
                    incomeSortArray.filter((element)=>{
                        //標籤替換中文
                        switch (element.type) {
                            case '0':
                                element.type = '薪水'
                                break;
                            case '1':
                                element.type = '投資'
                                break;
                            case '2':
                                element.type = '其他'
                                break;
                            default:
                                break;
                        }
                        this.labelList.push(element.type)
                        this.setData.filter((value)=>{
                            value.backgroundColor.push(
                                "rgb("
                                + Math.floor(Math.random() * 256)+","
                                + Math.floor(Math.random() * 256)+","
                                + Math.floor(Math.random() * 256)+")",
                            )
                            value.data.push(element.value)
                        })
                    })
                    
                    
                    break;
                case 3:
                    console.log("支出")
                    //過濾Flag 與支出
                    const expenditureArray = this.shareState.lists.filter((element)=>{
                        return element.flag === 0 && element.moneyTypeInput === 1
                    })
                    expenditureArray.length === 0 ? this.noData = true : this.noData = false
                    const expenditureSortArray = expenditureArray.reduce((acc, cur, i) => {
                        const item = i > 0 && acc.find(element => element.type == cur.exesType)
                        if(item){
                            item.value += parseInt(cur.amount);
                        }else{
                            acc.push(
                                {
                                    type:cur.exesType, 
                                    value:parseInt(cur.amount)
                                }
                            );
                        }
                        return acc;
                    }, [])
                    this.setData = [{backgroundColor:[],data:[]}]
                    expenditureSortArray.filter((element)=>{
                        //標籤替換中文
                        switch (element.type) {
                            case '0':
                                element.type = '伙食費'
                                break;
                            case '1':
                                element.type = '交通費'
                                break;
                            case '2':
                                element.type = '治裝費'
                                break;
                            case '3':
                                element.type = '貸款'
                                break;
                            case '4':
                                element.type = '電話費'
                                break;
                            case '5':
                                element.type = '其他'
                                break;
                            default:
                                break;
                        }
                        this.labelList.push(element.type)
                        this.setData.filter((value)=>{
                            value.backgroundColor.push(
                                "rgb("
                                + Math.floor(Math.random() * 256)+","
                                + Math.floor(Math.random() * 256)+","
                                + Math.floor(Math.random() * 256)+")",
                            )
                            value.data.push(element.value)
                        })
                    })
                    
                    break; 
            }
        }
    },
    watch:{
        chartType:function(){
			//this.renderChart(this.data, this.options);
			this.changeData();
        },
    }
}
//圖表顯示(pie)
Vue.component("pie-chart", {
    extends: VueChartJs.Pie,
    props: ["chartData", "options"],
    data(){
        return {
            labelList : [],
            setData : []
        }
    },
    methods: {
		renderLineChart: function() {
            this.renderChart(
            {
                labels: this.chartData.labelList,
                datasets: this.chartData.setData
            },
            { responsive: true, maintainAspectRatio: false }
		);      
		}
    },
	watch: {
        chartData:function(value)
        {
            
            if(value.labelList.length > 0){
                this.renderLineChart();
            }
        }
	},
    computed:{
        
    }
});
const ErrorPage ={
    template :`<div>錯誤</div>`
}
const Login ={
    template:`<div class="page">LoginPage</div>`
}

const LOAD_DATA = 'loadData'
const SET_LIST = 'setList'
const UPDATE_LIST = 'updateList'
const DELETE_LIST = 'deleteList'
const SET_ACTIONS = 'setActions'
var store = new Vuex.Store({
    state: {
        lists: [],
        actionType : 0,
        originalArray:{},
    },
    mutations: {
        [SET_LIST](state, payload){
            console.log(payload.moneyTypeInput)
            state.lists.push({
                amount: payload.amount,
                dateInput:payload.dateInput,
                exesType:payload.exesType,
                flag:payload.flag,
                incomeType:payload.incomeType,
                moneyTypeInput:payload.moneyTypeInput,
                timestrip:new Date().getTime(),
            })
        },
        [UPDATE_LIST](state,payload){
            //更改Flag
            state.lists.filter((value)=>{
                if (value.timestrip === payload.timestrip){
                    return value.flag = 1
                }
            })
            //新增紀錄
            state.lists.push({
                amount: payload.amount,
                dateInput:payload.dateInput,
                exesType:payload.exesType,
                flag:payload.flag,
                incomeType:payload.incomeType,
                moneyTypeInput:payload.moneyTypeInput,
                timestrip:new Date().getTime(),
            })
        },
        [DELETE_LIST](state,payload){
            //更改Flag
            state.lists.filter((value)=>{
                if (value.timestrip === payload.timestrip){
                    return value.flag = 1
                }
            })
        },
        [SET_ACTIONS](state,payload){
            state.actionType = payload.type
            state.originalArray = payload.originalArray
        },
        loadJSON(state, json) {
            state.lists = JSON.parse(json);
        }
    },
    actions:{
        ADD({commit},data){
            return new Promise ((resolve,reject)=>{
                commit(SET_LIST,data)
            })
        },
        UPDATE({commit},payload){
            return new Promise ((resolve,reject)=>{
                commit(UPDATE_LIST,payload)
            })
        },
        DELETE({commit},payload){
            return new Promise ((resolve,reject)=>{
                commit(DELETE_LIST,payload)
            })
        },
        SETACTIONS({commit},payload){
            return new Promise ((resolve,reject)=>{
                commit(SET_ACTIONS,payload)
            })
        },
    },
    getters: {
        filterList(state){
            return state.lists.filter((value)=>{
                return value.flag === 0
            });
        },
        
        allTodos(state) {
            return state.lists.filter((value)=>{
                return value.flag === 0
            });
        },
        toJSON(state) {
            return JSON.stringify(state.lists);
        }
    }
});

const router = new VueRouter({
    routes: [
        {
            path: "/", 
			components:{
                nav:Nav,
                display:listDisplay,
            }
        },
		{
            path: '/chart', 
            components: {
                nav:Nav,
                chart:Chart
            },
        },
        {
            path: '/404', 
            component: ErrorPage 
        },
        {
            path: '*', 
            redirect: '/404'
        },
        {
            path :'/Login',
            name: 'Login',
            component: Login
        }
    ]
});

new Vue({
    el: '#app',
    store,
    router,
    data: function() {
        return {
            newTodoText: "",
            doneFilter: false
        }
    },
    methods: {
        loadState() {
            if (localStorage.getItem('lists')) {
                this.$store.commit('loadJSON', localStorage.getItem('lists'));  
            }
        },

    },
    computed: {
    },
    mounted: function() {
        this.loadState();
    }
})