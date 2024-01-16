Component({
    properties: {
        sex: { type: String, value: "male", options: ["male", "female"] },
        size: {type: Number, value: 18}
    },
    data: {
        color: "",
    },
    methods: {},
    attached() {
        let color = "",
            that = this
        if (that.properties.sex === "male") {
            color = "#4ba4ff"
        } else if (that.properties.sex === "female") {
            color = "#fa8fbd"
        }
        that.setData({
            color: color,
        })
    },
});
