const FEEDBACK_APPID = "wx8abaf00ee8c3202e"
const API_DOMAIN = "https://doi.qizue.com"
const IMAGE_CACHE = "__IMAGES__"
const OPEN_ID = "__OPEN__ID__"
const TOKEN = "__TOKEN__"
const USERS = "__USERS__"
const STATUS_COLORS  = [
    "#007bff",
    "#dc3545",
    "#e83e8c",
    "#ffc107",
    "#17a2b8"
];

const ROLE_ARRAY = [
    {"value": 0, "label": "女性"},
    {"value": 1, "label": "男性"},
    {"value": 2, "label": "Gay(0)"},
    {"value": 3, "label": "Gay(1)"},
    {"value": 4, "label": "Gay(0.5)"},
    {"value": 5, "label": "LES"}]
const HEIGHT_ARRAY = [{"value":140,"label":"140cm"},{"value":141,"label":"141cm"},{"value":142,"label":"142cm"},{"value":143,"label":"143cm"},{"value":144,"label":"144cm"},{"value":145,"label":"145cm"},{"value":146,"label":"146cm"},{"value":147,"label":"147cm"},{"value":148,"label":"148cm"},{"value":149,"label":"149cm"},{"value":150,"label":"150cm"},{"value":151,"label":"151cm"},{"value":152,"label":"152cm"},{"value":153,"label":"153cm"},{"value":154,"label":"154cm"},{"value":155,"label":"155cm"},{"value":156,"label":"156cm"},{"value":157,"label":"157cm"},{"value":158,"label":"158cm"},{"value":159,"label":"159cm"},{"value":160,"label":"160cm"},{"value":161,"label":"161cm"},{"value":162,"label":"162cm"},{"value":163,"label":"163cm"},{"value":164,"label":"164cm"},{"value":165,"label":"165cm"},{"value":166,"label":"166cm"},{"value":167,"label":"167cm"},{"value":168,"label":"168cm"},{"value":169,"label":"169cm"},{"value":170,"label":"170cm"},{"value":171,"label":"171cm"},{"value":172,"label":"172cm"},{"value":173,"label":"173cm"},{"value":174,"label":"174cm"},{"value":175,"label":"175cm"},{"value":176,"label":"176cm"},{"value":177,"label":"177cm"},{"value":178,"label":"178cm"},{"value":179,"label":"179cm"},{"value":180,"label":"180cm"},{"value":181,"label":"181cm"},{"value":182,"label":"182cm"},{"value":183,"label":"183cm"},{"value":184,"label":"184cm"},{"value":185,"label":"185cm"},{"value":186,"label":"186cm"},{"value":187,"label":"187cm"},{"value":188,"label":"188cm"},{"value":189,"label":"189cm"},{"value":190,"label":"190cm"},{"value":191,"label":"191cm"},{"value":192,"label":"192cm"},{"value":193,"label":"193cm"},{"value":194,"label":"194cm"},{"value":195,"label":"195cm"},{"value":196,"label":"196cm"},{"value":197,"label":"197cm"},{"value":198,"label":"198cm"},{"value":199,"label":"199cm"},{"value":200,"label":"200cm"},{"value":201,"label":"201cm"},{"value":202,"label":"202cm"},{"value":203,"label":"203cm"},{"value":204,"label":"204cm"},{"value":205,"label":"205cm"},{"value":206,"label":"206cm"},{"value":207,"label":"207cm"},{"value":208,"label":"208cm"},{"value":209,"label":"209cm"},{"value":210,"label":"210cm"},{"value":211,"label":"211cm"},{"value":212,"label":"212cm"},{"value":213,"label":"213cm"},{"value":214,"label":"214cm"},{"value":215,"label":"215cm"},{"value":216,"label":"216cm"},{"value":217,"label":"217cm"},{"value":218,"label":"218cm"},{"value":219,"label":"219cm"},{"value":220,"label":"220cm"}]
const WEIGHT_ARRAY = [{"value":30,"label":"30kg"},{"value":31,"label":"31kg"},{"value":32,"label":"32kg"},{"value":33,"label":"33kg"},{"value":34,"label":"34kg"},{"value":35,"label":"35kg"},{"value":36,"label":"36kg"},{"value":37,"label":"37kg"},{"value":38,"label":"38kg"},{"value":39,"label":"39kg"},{"value":40,"label":"40kg"},{"value":41,"label":"41kg"},{"value":42,"label":"42kg"},{"value":43,"label":"43kg"},{"value":44,"label":"44kg"},{"value":45,"label":"45kg"},{"value":46,"label":"46kg"},{"value":47,"label":"47kg"},{"value":48,"label":"48kg"},{"value":49,"label":"49kg"},{"value":50,"label":"50kg"},{"value":51,"label":"51kg"},{"value":52,"label":"52kg"},{"value":53,"label":"53kg"},{"value":54,"label":"54kg"},{"value":55,"label":"55kg"},{"value":56,"label":"56kg"},{"value":57,"label":"57kg"},{"value":58,"label":"58kg"},{"value":59,"label":"59kg"},{"value":60,"label":"60kg"},{"value":61,"label":"61kg"},{"value":62,"label":"62kg"},{"value":63,"label":"63kg"},{"value":64,"label":"64kg"},{"value":65,"label":"65kg"},{"value":66,"label":"66kg"},{"value":67,"label":"67kg"},{"value":68,"label":"68kg"},{"value":69,"label":"69kg"},{"value":70,"label":"70kg"},{"value":71,"label":"71kg"},{"value":72,"label":"72kg"},{"value":73,"label":"73kg"},{"value":74,"label":"74kg"},{"value":75,"label":"75kg"},{"value":76,"label":"76kg"},{"value":77,"label":"77kg"},{"value":78,"label":"78kg"},{"value":79,"label":"79kg"},{"value":80,"label":"80kg"},{"value":81,"label":"81kg"},{"value":82,"label":"82kg"},{"value":83,"label":"83kg"},{"value":84,"label":"84kg"},{"value":85,"label":"85kg"},{"value":86,"label":"86kg"},{"value":87,"label":"87kg"},{"value":88,"label":"88kg"},{"value":89,"label":"89kg"},{"value":90,"label":"90kg"},{"value":91,"label":"91kg"},{"value":92,"label":"92kg"},{"value":93,"label":"93kg"},{"value":94,"label":"94kg"},{"value":95,"label":"95kg"},{"value":96,"label":"96kg"},{"value":97,"label":"97kg"},{"value":98,"label":"98kg"},{"value":99,"label":"99kg"},{"value":100,"label":"100kg"}]
const YEARLY_SALARY = [
    {
        "value": "0",
        "label": "小于10w"
    },
    {
        "value": "1",
        "label": "10-20w"
    },
    {
        "value": "2",
        "label": "20-30w"
    },
    {
        "value": "3",
        "label": "30-50w"
    },
    {
        "value": "4",
        "label": "50-100w"
    },
    {
        "value": "5",
        "label": "100w以上"
    }
]

const JOB_ARRAY = [{"value":0,"label":"学生"},{"value":1,"label":"IT\/互联网"},{"value":2,"label":"教育\/科研"},{"value":3,"label":"建筑\/房地产"},{"value":4,"label":"生产\/制造"},{"value":5,"label":"金融"},{"value":6,"label":"政府机构"},{"value":7,"label":"医疗\/护理"},{"value":8,"label":"通信\/电子"},{"value":9,"label":"传媒\/艺术"},{"value":10,"label":"财会\/审计"},{"value":11,"label":"销售"},{"value":12,"label":"人事\/行政"},{"value":13,"label":"服务业"},{"value":14,"label":"交通运输"},{"value":15,"label":"商贸\/采购"},{"value":16,"label":"生物\/制药"},{"value":17,"label":"法律"},{"value":18,"label":"广告\/市场"},{"value":19,"label":"咨询\/顾问"},{"value":20,"label":"警察"},{"value":21,"label":"高级管理"},{"value":22,"label":"物流\/仓库"},{"value":23,"label":"农林牧渔"},{"value":24,"label":"自由职业"},{"value":25,"label":"其他职业"},{"value":26,"label":"待业"}]
const EDUCATION_ARRAY = [{"value":0,"label":"小学"},{"value":1,"label":"初中"},{"value":2,"label":"高中"},{"value":3,"label":"专科"},{"value":4,"label":"本科"},{"value":5,"label":"硕士"},{"value":6,"label":"博士"}]
const MARITAL_ARRAY = [{"value":0,"label":"未婚"},{"value":1,"label":"离异"},{"value":2,"label":"丧偶"}]
const DELISTING_ARRAY = [{"value":0,"label":"计划1年内结婚"},{"value":1,"label":"计划2年内结婚"},{"value":2,"label":"时机成熟就结婚"},{"value":3,"label":"我就想要谈恋爱"}]

module.exports = { FEEDBACK_APPID, API_DOMAIN , IMAGE_CACHE, OPEN_ID,
    TOKEN, USERS, STATUS_COLORS,
    DELISTING_ARRAY, MARITAL_ARRAY, HEIGHT_ARRAY, WEIGHT_ARRAY, YEARLY_SALARY, JOB_ARRAY, EDUCATION_ARRAY, ROLE_ARRAY}
