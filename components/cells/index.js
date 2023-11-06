
Component({
    options: {
        multipleSlots: true,
    },
    properties: {
        arrow: Boolean,
        bordered: Boolean,
        description: String,
        hover: Boolean,
        image: String,
        leftIcon: String,
        note: String,
        required: Boolean,
        rightIcon: String,
        title: String,
        url: String
    },
    data: {},
    methods: {
        onClick(e) {
            this.triggerEvent('click', e.detail);
        }
    }
});
