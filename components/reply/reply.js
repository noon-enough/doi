import {getLocalUid} from "../../utils/util";

Component({
    properties: {
        reply: Object,
    },
    data: {},
    methods: {
        onLongPress(e) {
            this.triggerEvent('longlongpress', e.detail);
        },
        onDetail(e) {
            let that = this,
                uid =  e.currentTarget.dataset.uid ?? 0,
                localUid = getLocalUid(),
                isSelf = uid === localUid
        }
    }
});
