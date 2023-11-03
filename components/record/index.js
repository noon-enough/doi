import {getTimeDate} from "../../utils/util";

Component({
    properties: {
        posture: {
            type: Array,
            value: [],
        },
        status: {
            type: Array,
            value: [],
        },
        recode: {
            type: Object,
            value: {
                create_time: getTimeDate(),
                watcher: false,
                duration: 10,
                comment: "",
                star: 3,
                status: 4,
                posture: [],
            }
        }
    },
    data: {},
    methods: {}
});
